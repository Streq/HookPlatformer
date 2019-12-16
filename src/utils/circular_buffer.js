export default class FixedCircularBuffer extends Array{
	constructor (size){
		super(size);
		this.index_oldest = 0;
		this.index_newest = 0;
	}

	push(element){
		this.index_newest = this.index_oldest;
		this[this.index_newest] = element;
		this.index_oldest = (this.index_oldest - 1 + this.length)%this.length;
	}
	forEach(callbackfn){
		let 
			length = this.length
		,	first = this.index_newest
		,	i
		;
		for(i = first; i < length; ++i){
			callbackfn(this[i],i,this);
		}
		for(i = 0; i < first; ++i){
			callbackfn(this[i],i,this);
		}
	}
	forEachWithBreak(callbackfn){
		let 
			length = this.length
		,	first = this.index_newest
		,	i
		;
		for(i = first; i < length; ++i){
			if(callbackfn(this[i],i,this)){
				return;
			}
		}
		for(i = 0; i < first; ++i){
			if(callbackfn(this[i],i,this)){
				return;
			}
		}
	}
	get(index){
		return this[(index+this.index_oldest+this.length)%this.length];
	}
}

//1,7,3,4,5,6
//    |