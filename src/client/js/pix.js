function getPix() {
	
	requestPix('http://localhost:8000/pix', {
			city: Client.city,
			country: Client.ctry
		}).then(pixData => {
		if(pixData.hits.length > 0) {
			console.log(pixData);
			document.getElementById('pix-image'). innerHTML = `<figure id="pix-frame"><img src="${pixData.hits[0].webformatURL}" alt="${Client.destination}"><figcaption>Image by <a href="${pixData.hits[0].userImageURL}">${pixData.hits[0].user}</a></figcaption></figure>`
		}
	})
}

const requestPix = async (url = ' ', data = {}) => {
	const response = await fetch(url, {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	try {
		const pixData = await response.json();
		return pixData;
	} catch (error) {
		console.log('error', error);
	}
}

export {
getPix
}