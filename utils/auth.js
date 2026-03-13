
// Sjekker om brukeren er admin ved å kalle API-et
export async function checkUser() {
	try {
		const res = await fetch('/api/check-admin', { credentials: 'include' });
		const data = await res.json();
		return data.isAdmin;
	} catch (e) {
		return false;
	}
}
