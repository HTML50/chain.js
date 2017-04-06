var taskList=[],
  errorList=[],
  successList=[];
  
function chain(){

  this.length = arguments.length
  
  for(i=0;i<length;i++){
 
    taskList.push(arguments[i]);
  }
  

  console.log('initialized')
}




var _setTimeout = setTimeout,
    setTimeout = function(fn,time){
     var source = fn.toString(),
      startPos = source.indexOf('{') + 2,
      endPos = source.lastIndexOf('}') -1;
      source = source.substring(startPos,endPos)+ "taskList.shift();next();successList.push(fn.name)";
     
      try{
        _setTimeout(function(){eval(source)},time);
      }
      catch(err){
        errorList.push(fn.name);
      }  
        
    }

//此处的fn为同步函数
//如果为setTimeout/ajax等，则无需
function task(fn){
  var source = fn.toString(),
      startPos = source.indexOf('{') + 2,
      endPos = source.lastIndexOf('}') -1;
      source = source.substring(startPos,endPos); 
      if(source.indexOf('ajax')==-1 && source.indexOf('setTime')==-1) {
        source += "taskList.shift();next();successList.push(fn.name)";
      }

      try{
        eval(source);
      }
      catch(err){
        errorList.push(fn.name);
      }
}
  next = function(){
  if(taskList.length>0) task(taskList[0]);
  else console.log('job done')
  }
  start= function(){
  next();
  }
  
