define(["utils/dom"],function (Dom) {
	function readTextFile(file) {
		return new Promise((resolve, reject)=>{
			var rawFile = new XMLHttpRequest();
			rawFile.open("GET", file, true);
			rawFile.onreadystatechange = function ()
			{
				if(rawFile.readyState === 4)
				{
					if(rawFile.status === 200 || rawFile.status == 0)
					{
						var allText = rawFile.responseText;
						resolve(allText);
					}
				}
			}
			rawFile.send(null);
		});
	}
	
	function readHtmlFile(file) {
		return readTextFile(file).then((allText)=>Dom.create(allText));
	}
	function templateFromFile(htmlFilePath){
		//TODO
	}
	
	return {
		readText: readTextFile,
		readHtml: readHtmlFile,
		template: templateFromFile
	};
});
