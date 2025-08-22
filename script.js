async function loadRoots(serverBase)
{
	const url = serverBase.replace(/\/+$/, '') + '/listRoots';
	try {
		const res = await fetch(url);

		if (!res.ok) throw new Error('HTTP ' + res.status);

		const data = await res.json();
		const select = document.getElementById('rootSelect');
		select.innerHTML = '';
		if (data.roots && data.roots.length > 0)
		{
			data.roots.forEach(r => {
				const opt = document.createElement('option');
				opt.value = r;
				opt.textContent = r;
				select.appendChild(opt);
			});
		} else {
			const opt = document.createElement('option');
			opt.textContent = 'Keine Verzeichnisse gefunden';
			select.appendChild(opt);
		}
	} catch (err) {
		console.error(err);
	}
}

document.getElementById('addForm').addEventListener('submit', async (e) =>
{
	e.preventDefault();
	const serverBase = document.getElementById('serverBase').value.trim();
	const entryType = document.querySelector('input[name="entryType"]:checked').value;
	const ttl = parseInt(document.getElementById('ttl').value, 10);
	const amount = parseInt(document.getElementById('amount').value, 10);
	const root = document.getElementById('rootSelect').value;
	const subPath = document.getElementById('subPath').value.trim();
	const fullPath = `/srv/${root}${subPath ? '/' + subPath : ''}`;

	const payload = {
		type: entryType,
		path: fullPath,
		ttl: ttl,
		maxDownloads: amount
	};

	try {
		const url = serverBase.replace(/\/+$/, '') + '/addEntry';
		const res = await fetch(url, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(payload)
		});

		const box = document.getElementById('result');

		if (!res.ok) {
			box.hidden = false;
			box.innerHTML = '<strong class="error"> Fehler: </strong>' + await res.text();
			return;
		}

		const data = await res.json();
		box.hidden = false;

		
		const replacedUrl = replaceHost(data.path, "home.whisper-me.de");
		box.innerHTML = `<strong> Neuer Pfad: </strong> <br> ${replacedUrl}`;

	} catch (err) {
		console.error(err);
	}
});

function replaceHost(url, newHost) {
	const u = new URL(url);
	u.host = newHost;
	return u.toString();
}


document.addEventListener('DOMContentLoaded', () =>
{
	const serverBase = document.getElementById('serverBase').value.trim();
	loadRoots(serverBase);
});
