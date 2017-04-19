# chain.js

a tiny lib for executing synchronous and asynchronous functions in order. 



## Demo

[load images and show them with chain.js](https://html50.github.io/chain.js/)



## Usage

include chain.js and `new Chain` when document is ready.

```html
<script src='chain.js'></script>
<script>
var job = new Chain(some functions);
job.start();
</script>
```



## Options

**Chain.start()**

start the job in the task queue.

```javascript
var job = new Chain(fn1,fn2,fn3);
job.start();

```



**Chain.add(fn)**

add a job in the end of task queue.

```javascript
function fn4(){
  //do something
}

job.add(fn4);
//job list: [fn1,fn2,fn3,fn4]
```

**Chain.add(index, fn)**

add a job in specified position.

```javascript
function fn4(){
  //do something
}

job.add(0,fn4);
//job list: [fn4,fn1,fn2,fn3]
```



## Todolist

- [x] basic usage
- [ ] optimize setTimeout, ajax in different situation



## Contributions

Contributions are welcome. 

Feel free to create issues and pull request.