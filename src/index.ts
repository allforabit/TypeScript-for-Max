import '@babel/polyfill'
// import './console-log-polyfill'
import * as em from './example-module'

inlets = 1;
outlets = 1;
autowatch = 1;


function bang() {
	let theObject = new em.TheClass(42);
	post("theObject.getIndex(): " + theObject.getIndex() + "\n");
	post("The square of pi is " + em.square(Math.PI) + "\n");

	// Cast to <any> to assign properties to objects of type Global.
	// You must give the global a name, otherwise it may cause crashes in max
	// when the global is freed
	var g = new Global("TypescriptTest");
	(<any>g).newProperty = "I am new.";
  post("hi")
}


post("hello")

function msg_float(v: number)
{
	// outlet(0, em.square(v));
}

function msg_int(v: number)
{
	// outlet(0, em.square(v));
}
