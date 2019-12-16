/**@description Listens to html Events and fires app Events */
export default class HtmlInputHandler{
	constructor(mappings){
		this.mappings = mappings;
	}
	/**@param element {HTMLElement} */
	listen(element, callback){
		for(var eventType in this.mappings){
			let handler = this.mappings[eventType];
			//create a handler that binds the listened element 
			//and signals the observers
			let boundHandler = (htmlEvent)=>{
				let appEvent = handler(event,element);
				if(appEvent){
					callback(appEvent);
				}
			};
			
			element.addEventListener(eventType,boundHandler);
			//store for future unlisten
			this[eventType] = boundHandler;
		}
	}
	/**@param element {HTMLElement} */
	unlisten(element){
		for(var eventType in this.mappings){
			element.removeEventListener(eventType,this[eventType]);
		}
	}
}
