//2016-12-29 9:30:45 from Tien.Lo QQ:77209302 么么
(function(global, factory){
	"use strict";
	//window is global.
	if(typeof module === "object" && typeof module.exports === "object"){
		// For CommonJS
		module.exports = factory(global);
	}else{
		factory(global);
	}

})(typeof window !== "undefined" ? window : this,function(window){
var
	version = "0.0.1",
	document = window.document,
	HerGhost = function( obj ) {

		// The HerGhost object is actually just the init constructor 'enhanced'
		// Need init if HerGhost is called (just allow error to be thrown if not included)
		return new HerGhost.fn.init( obj );
	};
	
	HerGhost.fn = HerGhost.prototype = {
		version:version,
	};
var
	init = HerGhost.fn.init = function( obj ) {
		// HANDLE: HerGhost(""), HerGhost(null), HerGhost(undefined), HerGhost(false)
		if ( !obj ) {
			throw Error("obj is null");
		}
		HerGhost.ready(obj.ready);
		this.data = obj.data; 
		HerGhost.$loader.use('drive').observr(this.data,this); 
		var 
			id = obj.element,
			dom = HerGhost.$loader.use('drive').nodeToFragment(document.getElementById(id),this,obj);
		document.getElementById(id).appendChild(dom);
		return this;
	};
	init.prototype = HerGhost.fn;
	//HerGhost.extend({x}) this is HerGhost.x
	//HerGhost.fn.extend({x}) this is HerGhost().x
	HerGhost.extend = HerGhost.fn.extend = function() {
	var 
		_isObject = function(o){
	        return Object.prototype.toString.call(o) === '[object Object]';
	    },
	    _isFunction = function(f){
		    return typeof f == 'function';
		},
		_extend = function(destination, source) {
	        var property;
	        for (property in destination) {
	            if (destination.hasOwnProperty(property)) {
	                if ((_isObject(destination[property]) && _isObject(source[property]))) {
	                    arguments.callee(destination[property], source[property]);
	                };
	                if (source.hasOwnProperty(property)) {
	                    continue;
	                } else {
	                    source[property] = destination[property];
	                }
	            }
	        }
	    },
	    arr=[],
        result = this,
        i;
        if(_isObject(arguments[0])){
        	arr.push(this);
        	arr.push(arguments[0]);
        }
        if (arr.length!==2){
        	throw Error("HerGhost.fn.extend/HerGhost.fn args error!");
		}
        for (i = arr.length - 1; i >= 0; i--) {
            _extend(arr[i], result);
        }
        if(_isFunction(this) && !_isObject(this)){
        	HerGhost = result;
        }else if(_isObject(this)){
	         init.prototype = HerGhost.fn = result;
	        
        }
	}
	HerGhost.extend({
		ArrayUtils:{
			contains:function(arr,needle){
				for (i in arr) {    
					if (arr[i] == needle) 
					return true;  
				}  
				return false;
			},
			removeRepeat:function(arr) {
			    var ret = [];
			    for (var i = 0; i < arr.length; i++) {
			        if (ret.indexOf(arr[i]) === -1) {
			            ret.push(arr);
			        }
			    }
			    return ret;
			}
		},
		StringUtils:{
			trim:function(str){
				var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\n\
				\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
				for(var i=0;i<str.length;i++){
					if(whitespace.indexOf(str.charAt(i)) === -1){
						str = str.substring(i);
						break;
					}
				}
				for(i = str.length-1;i>=0;i--){
					if(whitespace.indexOf(str.charAt(i)) === -1){
						str = str.substring(0,i+1);
						break;
					}
				}
				return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
			}
		},
		NodeUtils:{
			hasAttribute:function(node,str){
				if(!!node.attributes){
					for(var i = 0;i<node.attributes.length;i++){
						if(node.attributes[i].nodeName === str){
							return true;
						}
					}
				}
				return false;
			}
		},
		uuid:function(len, radix) {
		    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		    var uuid = [], i;
		    radix = radix || chars.length;
		    if (len) {
		      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
		    } else {
		      var r;
		      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		      uuid[14] = '4';
		      for (i = 0; i < 36; i++) {
		        if (!uuid[i]) {
		          r = 0 | Math.random()*16;
		          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
		        }
		      }
		    }
		    return uuid.join('');
		},
		ready:(function() {
		    var funcs = [];      
		    var ready = false;  
		    function handler(e) {
		        if(ready){
		        	return;
		        }
		        if(e.type === 'onreadystatechange' && document.readyState !== 'complete') {
		            return;
		        }
		        for(var i=0; i<funcs.length; i++) {
		            funcs[i].call(document);
		        }
		        ready = true;
		        funcs = null;
		    }
		    if(document.addEventListener) {
		        document.addEventListener('DOMContentLoaded', handler, false);
		        document.addEventListener('readystatechange', handler, false);            //IE9+
		        window.addEventListener('load', handler, false);
		    }else if(document.attachEvent) {
		        document.attachEvent('onreadystatechange', handler);
		        window.attachEvent('onload', handler);
		    }
		    return function Ready(fn) {
		        if(ready) { fn.call(document); }
		        else { funcs.push(fn); }
		    }
		})(),
		$loader:(function () {
		    var moduleSet = {};
		    var $proxy = function () {};
		    var loader = {
		        define: function(name, dependencies, fn) {
		            if (!moduleSet[name]) {
		                var module = {
		                    name: name,
		                    dependencies: dependencies,
		                    fn: fn
		                };
		                moduleSet[name] = module;
		            }
		            return moduleSet[name];
		        },
		        use: function(name) {
		            var module = moduleSet[name];
		
		            if (!module.entity) {
		                var args = [];
		                for (var i=0; i<module.dependencies.length; i++) {
		                    if (moduleSet[module.dependencies[i]].entity) {
		                        args.push(moduleSet[module.dependencies[i]].entity);
		                    }
		                    else {
		                        args.push(this.use(module.dependencies[i]));
		                    }
		                }
		
		                module.entity = module.fn.apply($proxy, args);
		            }
		
		            return module.entity;
		        },
		    };
		    loader.define.amd = { README:'YEAH MAN!' };
		    return loader;
		})(),
	});
	HerGhost.$loader.define("request.ajax", [], function() {
		var 
			XHR_$O = (function () {
				if (typeof XMLHttpRequest !== 'undefined') {
					return new XMLHttpRequest();
				}
				var versions = [
					"MSXML2.XmlHttp.6.0",
					"MSXML2.XmlHttp.5.0",
					"MSXML2.XmlHttp.4.0",
					"MSXML2.XmlHttp.3.0",
					"MSXML2.XmlHttp.2.0",
					"Microsoft.XmlHttp"
				];
				var xhr;
				for (var i = 0; i < versions.length; i++) {
					try {
						xhr = new ActiveXObject(versions[i]);
						break;
					} catch (e) {
						e.printStack();
					}
				}
				return xhr;
			})(),
			XHRSend_$F = function(url, method, data, success,fail,async,progress){
				if (async === undefined) {
					async = true;
				}
				var x = XHR_$O;
				if(typeof progress == 'function'){
					x.addEventListener("progress", progress);
				}
				x.open(method, url, async);
				x.onreadystatechange = function () {
					switch(x.readyState){
						case 1:
							
							break;
						case 2:
							break;
						case 3:
							break;
						case 4:
							var 
								status = x.status;
							if (status >= 200 && status < 300) {
								success && success(x.responseText,x.responseXML)
							} else {
								fail && fail(status);
							}
							break;
						default:
							throw new Error("AJAX onreadystatechange ERROR!");
							break;
					}
				};
				if (method == 'POST') {
					x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				}
				x.send(data);
			},
			ajax = function(options){
				var query = [];
				for (var key in options.data) {
					query.push(encodeURIComponent(key) + '=' + encodeURIComponent(options.data[key]));
				}
				switch (options.type.toUpperCase()){
					case 'GET':
						XHRSend_$F(options.url + (query.length ? '?' + query.join('&') : ''), 'GET', null, options.success, options.fail, options.async,options.progress);
						break;
					case 'POST':
						XHRSend_$F(options.url,'POST', query.join('&'), options.success, options.fail, options.async,options.progress)
						break;
					default:
						throw new Error("Unset Ajax GET/POST");
						break;
				}
			};
		return ajax;
	});
	HerGhost.$loader.define("drive", [], function() {
		var that = this;
		that.componentReused_$A = [];
		function componentsToDocument(component,node){
			if((typeof component.template)!=='undefined'){
				node.innerHTML = component.template;
			}else if((typeof component.templateUrl)!=='undefined'){
				var componentUrl_$S = that.componentReused_$A[component.templateUrl];
				if(componentUrl_$S){
					node.innerHTML = componentUrl_$S;
				}else{
					HerGhost.$loader.use('request.ajax')({
						url:component.templateUrl,
						type:'GET',
						async:false,
						success:function(text){
							node.innerHTML = that.componentReused_$A[component.templateUrl] = text;
						},
						fail:function(status){
							throw new Error("componentsToFragment:fail,status:"+status);
						},
					});
				}
			}else{
				throw new Error('template/templateUrl is empty!');
			}
			node.childNodes[0].setAttribute('hg-component','');
			node.childNodes[0].setAttribute('hg-'+HerGhost.uuid(16,16),'');
			node.parentNode.replaceChild(node.childNodes[0],node);
			node = null;
		};
		function nodeToFragment(node,context,options){
			var 
				flag = document.createDocumentFragment(),
				child,c;
				while(child=node.firstChild){
					if(!HerGhost.NodeUtils.hasAttribute(child,'hg-component')){
						complier(child,context,options);
					}
					if(!(child.nodeName in options.components)){// 
						flag.appendChild(child);
					}
				}
				return flag;
		}
		function complier(node,context,options){
			var
				reg_g = /[\{][\{]([^\{\}]*)[\}][\}]/g, 
				reg_content = /\{\{(.*)\}\}/,
				attr,
				nodeText = [],
				isExistArr = [];
			
			switch (node.nodeType){
				case 1:
					if(node.nodeName in options.components){
						componentsToDocument(options.components[node.nodeName],node);
					}else{
						for(var i=0;i<node.childNodes.length;i++){
							complier(node.childNodes[i],context,options);
						}
						attr = node.attributes;
						for (var i=0;i<attr.length;i++) {
							if(attr[i].nodeName=='hg-model'){
								var name = attr[i].nodeValue;
								node.addEventListener('input',function(e){
									context[name] = e.target.value;
								});
								node.value = context[name];
								node.removeAttribute('hg-model');
							}
						}
					}
					break;
				case 3:
					if(reg_g.test(node.nodeValue)){
						var name,arr;
						nodeText[0] = node.nodeValue;
						arr = node.nodeValue.match(reg_g);
						for(var i=0;i<arr.length;i++){
							name = reg_content.exec(arr[i])[1]
							name = name.trim();
							if(!HerGhost.ArrayUtils.contains(isExistArr,name)){
								isExistArr.push(name);
								new Watcher(context,node,name,nodeText);
							}
						}
					}
					break;
				default:
					break;
			}
		}
		that.nodeValueArr_$Watcher = []
		function Watcher(context,node,name,nodeText){
			this.nodeText = nodeText;
			this.NODETOGGLEFLAG = true;
			Dep.target = this;
			this.name = name;
			this.node = node;
			this.context = context;
			this.update();
			Dep.target = null;
		}
		Watcher.prototype = {
			update:function(old){
				this.get(old);
				this.node.nodeValue = this.value;
			},
			get:function(old){
				if(this.NODETOGGLEFLAG){
					that.nodeValueArr_$Watcher = this.nodeText[0].split(new RegExp('\{\{('+ this.name +')\}\}','g'));
					this.value = this.nodeText[0].replace(new RegExp('\{\{('+ this.name +')\}\}','g'),this.context[this.name]);
					this.NODETOGGLEFLAG = false;
				}else{
					that.nodeValueArr_$Watcher[1] = this.context[this.name];
					this.value = that.nodeValueArr_$Watcher.join('');
				}
			}
		}
		function defineReactive(obj,key,val){
			var dep = new Dep(),old;
			Object.defineProperty(obj,key,{
				get:function(){
					if(Dep.target){
						dep.addSub(Dep.target);
					}
					return val;
				},
				set:function(newval){
					if(newval===val){
						return;
					}
					old = val;
					val = newval;
					dep.notify(old);
				}
			});
		}
		function observr(obj,context){
			Object.keys(obj).forEach(function(key){
				defineReactive(context,key,obj[key]);
			});
		}
		function Dep(){
			this.subs = [];
		}
		Dep.prototype = {
			addSub:function(sub){
				this.subs.push(sub)
			},
			notify:function(old){
				this.subs.forEach(function(sub){
					sub.update(old);
				});
			}
		}
		return {
			componentsToDocument:componentsToDocument,
			nodeToFragment:nodeToFragment,
			complier:complier,
			Watcher:Watcher,
			defineReactive:defineReactive,
			observr:observr,
			Dep:Dep
		}
	});
	HerGhost.$loader.define('deferred',[],function(){
		function deferred(){ return new Promise(); }
		function Promise(){ this.callbacks = []; }
		Promise.prototype = { 
			construct: Promise, 
			resolve: function(result) { 
				this.complete('resolve', result); 
			},
			reject: function(result) {
			    this.complete("reject", result);
			},
	
			complete: function(type, result) {
			    while (this.callbacks[0]) {
			        this.callbacks.shift()[type](result);
			    }
			},
	
			then: function(successHandler, failedHandler) {
			    this.callbacks.push({
			        resolve: successHandler,
			        reject: failedHandler
			    });
			    return this;
			}
		};
		return deferred;
	});

	HerGhost.extend({
		isObject:function(o){
	        return Object.prototype.toString.call(o) === '[object Object]';
	    },
		__exception__Handler:function(obj,fn){
		var 
			that = this,
			arr = arguments;
			function error(){
				if(that.isObject(obj)){
					this.name = obj.name;
					this.message =obj.message;
				}else{
					this.name = "{name:undefined}";
					this.message ="{message:undefined}";
				}
			}
			error.prototype.printStack = function(){
				console.log("%c"+this.name+":"+this.message,"color:red");
			};
			error.prototype.toString = function(){
				return this.name+":"+this.message;
			};
			if(fn){
				error.prototype.remedy = fn;
			}
			return new error();
		},
	});
	
var
	EventsObserver = {
	    addEvent: function (callback) {
	        this.eventarr[this.eventarr.length] = callback;
	    },
	    removeEvent: function (callback) {
	        for (var i = 0; i < this.eventarr.length; i++) {
	            if (this.eventarr[i] === callback) {
	                delete (this.eventarr[i]);
	            }
	        }
	    },
	    removeAll:function(){
	    	for (var i = 0; i < this.eventarr.length; i++) {
	            delete (this.eventarr[i]);
	        }
	    },
	    publish: function (what) {
	        for (var i = 0; i < this.eventarr.length; i++) {
	            if (typeof this.eventarr[i] === 'function') {
	                this.eventarr[i](what);
	            }
	        }
	    },
	    make: function (o) { 
	        for (var i in this) {
	            o[i] = this[i];
	            o.eventarr = [];
	        }
	    }
	};
	//HANDLER:disableScroll/enableScroll: HerGhost.$loader.use('scrollHanlder').disableScroll() / HerGhost.$loader.use('scrollHanlder').enableScroll()
	HerGhost.$loader.define('scrollHanlder',[],function(){
	var 
		keys = { 37: 1, 38: 1, 39: 1, 40: 1 },
		oldonwheel, 
		oldonmousewheel1, 
		oldonmousewheel2, 
		oldontouchmove, 
		oldonkeydown,
	    isDisabled;
	
	    function scrollHanlder(){}
	    scrollHanlder.prototype.preventDefault =  function (e) {
	        e = e || window.event;
	        if (e.preventDefault)
	            e.preventDefault();
	        e.returnValue = false;
	    }
	   
	
	    scrollHanlder.prototype.preventDefaultForScrollKeys = function (e) {
	        if (keys[e.keyCode]) {
	        	try{
					this.preventDefault(e);
	        	}catch(err){
	        	}
	            return false;
	        }
	    }
	   
	    scrollHanlder.prototype.disableScroll = function disableScroll() {
	        if (window.addEventListener) {
	            window.addEventListener('DOMMouseScroll', this.preventDefault, false);
	        }
	        oldonwheel = window.onwheel;
	        window.onwheel = this.preventDefault; 
	
	        oldonmousewheel1 = window.onmousewheel;
	        window.onmousewheel = this.preventDefault; 
	        oldonmousewheel2 = document.onmousewheel;
	        document.onmousewheel = this.preventDefault;
	
	        oldontouchmove = window.ontouchmove;
	        window.ontouchmove = this.preventDefault; 
	
	        oldonkeydown = document.onkeydown;
	        document.onkeydown = this.preventDefaultForScrollKeys;
	        isDisabled = true;
	    }
	
	    scrollHanlder.prototype.enableScroll = function () {
	        if (!isDisabled) return;
	        if (window.removeEventListener){
	            window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
	        }
	
	        window.onwheel = oldonwheel; 
	
	        window.onmousewheel = oldonmousewheel1;
	        document.onmousewheel = oldonmousewheel2; 
	
	        window.ontouchmove = oldontouchmove; 
	
	        document.onkeydown = oldonkeydown;
	        isDisabled = false;
	    }
	    return new scrollHanlder();
	});
	HerGhost.$loader.define('animation.tween',[],function(){
		var Tween = {
		    Linear: function(t,b,c,d){ return c*t/d + b; },
		    Quad: {
		        easeIn: function(t,b,c,d){ return c*(t/=d)*t + b; },
		        easeOut: function(t,b,c,d){ return -c *(t/=d)*(t-2) + b; },
		        easeInOut: function(t,b,c,d){if ((t/=d/2) < 1) return c/2*t*t + b;return -c/2 * ((--t)*(t-2) - 1) + b;}
		    },
		    Cubic: {
		        easeIn: function(t,b,c,d){ return c*(t/=d)*t*t + b; },
		        easeOut: function(t,b,c,d){ return c*((t=t/d-1)*t*t + 1) + b; },
		        easeInOut: function(t,b,c,d){if ((t/=d/2) < 1) return c/2*t*t*t + b;return c/2*((t-=2)*t*t + 2) + b;}
		    },
		    Quart: {
		        easeIn: function(t,b,c,d){return c*(t/=d)*t*t*t + b;},
		        easeOut: function(t,b,c,d){return -c * ((t=t/d-1)*t*t*t - 1) + b;},
		        easeInOut: function(t,b,c,d){if ((t/=d/2) < 1) return c/2*t*t*t*t + b;return -c/2 * ((t-=2)*t*t*t - 2) + b;}
		    },
		    Quint: {
		        easeIn: function(t,b,c,d){return c*(t/=d)*t*t*t*t + b;},
		        easeOut: function(t,b,c,d){return c*((t=t/d-1)*t*t*t*t + 1) + b;},
		        easeInOut: function(t,b,c,d){if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;return c/2*((t-=2)*t*t*t*t + 2) + b;}
		    },
		    Sine: {
		        easeIn: function(t,b,c,d){ return -c * Math.cos(t/d * (Math.PI/2)) + c + b; },
		        easeOut: function(t,b,c,d){ return c * Math.sin(t/d * (Math.PI/2)) + b; },
		        easeInOut: function(t,b,c,d){ return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b; }
		    },
		    Expo: {
		        easeIn: function(t,b,c,d){ return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b; },
		        easeOut: function(t,b,c,d){return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;},
		        easeInOut: function(t,b,c,d){if (t==0) return b;if (t==d) return b+c;if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;}
		    },
		    Circ: {
		        easeIn: function(t,b,c,d){return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;},
		        easeOut: function(t,b,c,d){return c * Math.sqrt(1 - (t=t/d-1)*t) + b;},
		        easeInOut: function(t,b,c,d){if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;}
		    },
		    Elastic: {
		        easeIn: function(t,b,c,d,a,p){if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;if (!a || a < Math.abs(c)) { a=c; var s=p/4; }else var s = p/(2*Math.PI) * Math.asin (c/a);return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;},
		        easeOut: function(t,b,c,d,a,p){if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;if (!a || a < Math.abs(c)) { a=c; var s=p/4; }else var s = p/(2*Math.PI) * Math.asin (c/a);return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);},
		        easeInOut: function(t,b,c,d,a,p){if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);if (!a || a < Math.abs(c)) { a=c; var s=p/4; }else var s = p/(2*Math.PI) * Math.asin (c/a);if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;}
		    },
		    Back: {
		        easeIn: function(t,b,c,d,s){if (s == undefined) s = 1.70158;return c*(t/=d)*t*((s+1)*t - s) + b;},
		        easeOut: function(t,b,c,d,s){if (s == undefined) s = 1.70158;return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;},
		        easeInOut: function(t,b,c,d,s){if (s == undefined) s = 1.70158; if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;}
		    },
		    Bounce: {
		        easeIn: function(t,b,c,d){return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;},
		        easeOut: function(t,b,c,d){if ((t/=d) < (1/2.75)) {return c*(7.5625*t*t) + b;} else if (t < (2/2.75)) {return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;} else if (t < (2.5/2.75)) {return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;} else {return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;}},
		        easeInOut: function(t,b,c,d){if (t < d/2) return Tween.Bounce.easeIn(t*2, 0, c, d) * .5 + b;else return Tween.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;}
		    }
		};
		return Tween;
	});
	HerGhost.$loader.define('event.animation',[],function(){
		var OBJ = {},
            body=document.body || document.documentElement,
            style=body.style, 
            transition="transition",
            transitionEnd,
            animationEnd,
            vendorPrefix; 
          
        transition=transition.charAt(0).toUpperCase() + transition.substr(1);
  
        vendorPrefix=(function(){
            var  i=0, vendor=["Moz", "Webkit", "Khtml", "O", "ms"];
            while (i < vendor.length) {
                if (typeof style[vendor[i] + transition] === "string") {
                  return vendor[i];
                }
                i++;
            }
            return false;
        })();
  
        transitionEnd=(function(){
            var transEndEventNames = {
              WebkitTransition : 'webkitTransitionEnd',
              MozTransition    : 'transitionend',
              OTransition      : 'oTransitionEnd otransitionend',
              transition       : 'transitionend'
            }
            for(var name in transEndEventNames){
                if(typeof style[name] === "string"){
                    return transEndEventNames[name]
                }
            }
        })();
  
        animationEnd=(function(){
            var animEndEventNames = {
              WebkitAnimation : 'webkitAnimationEnd',
              animation      : 'animationend'
            }
            for(var name in animEndEventNames){
                if(typeof style[name] === "string"){
                    return animEndEventNames[name]
                }
            }
        })();
        OBJ.addTranEvent=function(elem,fn){
            var called=false;
            var fncallback = function(){
                    if(!called){
                        fn();
                        called=true;
                    }
            };
            (function handler(){    
                elem.addEventListener(transitionEnd, function () {
                    elem.removeEventListener(transitionEnd, arguments.callee, false);
                        fncallback();
                }, false);
            })();
        };
        OBJ.addAnimEvent=function(elem,fn){
            elem.addEventListener(animationEnd,fn,false)
        };
  
        OBJ.removeAnimEvent=function(elem,fn){
            elem.removeEventListener(animationEnd,fn,false)
        };
  
        OBJ.setStyleAttribute=function(elem,val){
            if(Object.prototype.toString.call(val)==="[object Object]"){
                for(var name in val){
                    if(/^transition|animation|transform/.test(name)){
                        var styleName=name.charAt(0).toUpperCase() + name.substr(1);
                        elem.style[vendorPrefix+styleName]=val[name];
                    }else{
                        elem.style[name]=val[name];
                    }
                }
            }
        };
        OBJ.transitionEnd=transitionEnd;
        OBJ.vendorPrefix=vendorPrefix;
        OBJ.animationEnd=animationEnd;
        return OBJ;
	});
	HerGhost.$loader.define('di',[],function(){
		var DI = function (dependency) {
		  this.dependency = dependency;
		};
		
		DI.prototype.inject = function (func) {
		  	var deps = /^[^(]+\(([^)]+)/.exec(func.toString());
		  	
		  	deps = deps ? deps[1]
		    	.split(/\s?,\s?/)
		    	.map(function (dep) {
		      		return this.dependency[dep];
		    	}.bind(this)) : [];
		    	
		  	return function () {
		    	return func.apply(this, deps);
		  	};
		};
		return DI;
	});
	HerGhost.fn.extend({
		$animate:function(options,callback){
			var 
				timer = null,
				start = 0,
				count = 0,
				endCount = 30;
			clearInterval(timer);
			timer = setInterval(function(){
					count++;
					if(count>endCount){
						clearInterval(timer);
						callback && callback();
						return;
					};
					if(options.style==='Linear'){
						options.el.style[options.style] = HerGhost.$loader.use('animation.tween')[options.tween](count,start,options.value,endCount)+"px";
					}else{
						options.el.style[options.style] = HerGhost.$loader.use('animation.tween')[options.tween][options.type](count,start,options.value,endCount)+"px";
					}
				}
			,30);
		},
		$event:{
			animation:HerGhost.$loader.use('event.animation'),
		},
		$inject:function(){},
	});

	// Register as a named AMD module,
	if ( typeof define === "function" && define.amd ) {
		define( "HerGhost", [], function() {
			return HerGhost;
		} );
	}
	
	window.HerGhost = HerGhost;
	return HerGhost;
});