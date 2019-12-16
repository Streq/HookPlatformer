export default function isSubset(subset, superset){
	for(const name in subset){
		if(subset[name]!=superset[name]){
			return false;
		}
	}
	return true;
}