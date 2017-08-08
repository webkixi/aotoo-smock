/*讲参数转换为数组
 * @param {all} a 参数
 */
var toarray = function(a){
	if(!a)return [];
	if(a instanceof Array)return a;
	var arr = [],
		len = a.length;
	if(/string|number/.test(typeof a) || a instanceof Function || len === undefined){
		arr[0] = a;
	}else{
		for(var i = 0;i < len;i++){
			arr[i] = a[i];
		}
	}
	return arr;	
}

function isarray(obj){
  return obj && Array.isArray(obj)
}

module.exports = {
	inject: require('aotoo-inject')(),
  find: require('lodash.find'),
  findIndex: require('lodash.findindex'),
  cloneDeep: require('lodash.clonedeep'),
  filter: require('lodash.filter'),
  merge: require('lodash.merge'),
  uniqueId: require('lodash.uniqueid'),
  isPlainObject: require('lodash.isplainobject'),
  isArray: isarray,
  toArray: toarray
}