export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { baseUrl, token } = body;

  if (!baseUrl || !token) {
    return { success: false, message: 'Mangler URL eller token' };
  }

  try {
    const res = await fetch(`${baseUrl}/api/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      const data = await res.json();
      return { 
        success: true, 
        message: `✅ Tilkobling vellykket! Home Assistant: ${data.message || 'API Running'}` 
      };
    } else {
      return { 
        success: false, 
        message: `❌ Tilkobling feilet (Status: ${res.status})` 
      };
    }
  } catch (e) {
    return { 
      success: false, 
      message: `❌ Feil: ${e.message || 'Kunne ikke koble til'}` 
    };
  }
});
