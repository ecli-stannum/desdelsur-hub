// api/update-transcript.js
// DESDELSUR Hub — Endpoint para cargar transcripciones desde GPT personalizado
// Recibe: grupo + sesion + transcriptRaw → actualiza sessions.json en GitHub

const GITHUB_OWNER = "ecli-stannum";
const GITHUB_REPO  = "desdelsur-hub";
const GITHUB_FILE  = "sessions.json";
const GITHUB_BRANCH = "main";

export default async function handler(req, res) {
  // CORS para que ChatGPT pueda llamarlo
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método no permitido" });
  }

  const { grupo, sesion, transcriptRaw } = req.body;

  // Validaciones básicas
  if (!grupo || !sesion || !transcriptRaw) {
    return res.status(400).json({
      success: false,
      error: "Faltan campos requeridos: grupo, sesion, transcriptRaw"
    });
  }

  const validGrupos = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"];
  const validSesiones = ["S1", "S2", "S3", "S4", "S5", "S6"];

  if (!validGrupos.includes(grupo)) {
    return res.status(400).json({
      success: false,
      error: `Grupo inválido: ${grupo}. Valores válidos: ${validGrupos.join(", ")}`
    });
  }
  if (!validSesiones.includes(sesion)) {
    return res.status(400).json({
      success: false,
      error: `Sesión inválida: ${sesion}. Valores válidos: ${validSesiones.join(", ")}`
    });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    return res.status(500).json({ success: false, error: "GITHUB_TOKEN no configurado" });
  }

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
    "User-Agent": "desdelsur-hub"
  };

  try {
    // 1. Leer el sessions.json actual desde GitHub
    const getUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}?ref=${GITHUB_BRANCH}`;
    const getResp = await fetch(getUrl, { headers });

    if (!getResp.ok) {
      const err = await getResp.text();
      return res.status(500).json({ success: false, error: "Error leyendo sessions.json: " + err });
    }

    const fileData = await getResp.json();
    const sha = fileData.sha;

    // 2. Decodificar y parsear
    const decoded = Buffer.from(fileData.content, "base64").toString("utf-8");
    const sessions = JSON.parse(decoded);

    // 3. Verificar que existe el grupo y la sesión
    if (!sessions[grupo]) {
      return res.status(404).json({
        success: false,
        error: `El grupo ${grupo} no existe en sessions.json`
      });
    }
    if (!sessions[grupo].sessions[sesion]) {
      return res.status(404).json({
        success: false,
        error: `La sesión ${sesion} no existe en el grupo ${grupo}. Sesiones disponibles: ${Object.keys(sessions[grupo].sessions).join(", ")}`
      });
    }

    // 4. Actualizar el campo transcriptRaw (sin modificar nada más)
    sessions[grupo].sessions[sesion].transcriptRaw = transcriptRaw;

    // 5. Encodificar y hacer commit a GitHub
    const newContent = Buffer.from(JSON.stringify(sessions, null, 2), "utf-8").toString("base64");

    const fecha = new Date().toISOString().split("T")[0];
    const commitMessage = `feat: transcripcion ${grupo} ${sesion} — ${fecha}`;

    const putUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;
    const putResp = await fetch(putUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: commitMessage,
        content: newContent,
        sha: sha,
        branch: GITHUB_BRANCH
      })
    });

    if (!putResp.ok) {
      const err = await putResp.text();
      return res.status(500).json({ success: false, error: "Error commiteando a GitHub: " + err });
    }

    const putData = await putResp.json();

    return res.status(200).json({
      success: true,
      mensaje: `✅ Transcripción de ${grupo} ${sesion} guardada correctamente`,
      commit: putData.commit?.sha?.substring(0, 7),
      chars: transcriptRaw.length
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
