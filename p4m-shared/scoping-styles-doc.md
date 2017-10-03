
---
Markdown Language Rules
---

# Heading

## Sub-heading

### Another deeper heading
 
Paragraphs are separated
by a blank line.

Two spaces at the end of a line leave a  
line break.

Text attributes _italic_, *italic*, __bold__, **bold**, `monospace`.

Horizontal rule:

---

Bullet list:

  * apples
  * oranges
  * pears

Numbered list:

  1. apples
  2. oranges
  3. pears

A [link](http://example.com).

---


# Scoped styling of P4M widgets 
A document explaining the methodology of scoping styles used in P4M and including examples of how to implement them.

## Why?
Identifying the twin problems of:
1. P4M widget styles being affected by host site stylesheets 
2. P4M styles affecting the styles of the host site

## (custom) css properties 
Get created by prefacing the property with two dashes: -- 
example:
--button-background-color: blue;
This tells he browser that we are declaring a new (custom) css property

To use this on out custom element, this (custom) css property will be added inside the custom element and will only be applied to elements within the <shiny-button> element.
We can set the default style (blue) for our --button-background-color custom property like so:

<dom-module id="shiny-button">
	<template>
		<style>
			.button {
				--button-background-color: blue; /* -You can use a standard style here  */
				background:var(--button-background-color, blue);  /* or you can declare a variable */
				@apply(--button-background-attributes);  /* or you can declare a mixin which will collect a range of attributes for our button - eg: background-color, color, padding, font-size etc.. */
			}
		</style>
	</template>
</dom-module>

If we like, we can set a variable here instead of just a style so we can have the option of styling different instances of the new property. Like so:

<dom-module id="shiny-button">
	<template>
		<style>
			.button {
				/* -button-background-color: blue;  */
				background:var(--button-background-color, blue);
			}
		</style>
	</template>
</dom-module>

so now when we go to change an *instance* of the custom property in the html we can modify the style like so:

<style is="custom-style"> /* The "is="custom-style" is a polyfill that is required for now */
	fancy-button {
		--button-background-color: green; /* here we're changing the value of our custom property in this instance only */
		--button-background-attributes: { /* here we're setting the values of the mixin */
			background: blue;
			color: #fff;
			font-size: 24px;
			padding:8px 16px;
		}
	}
</style>




<html>
	<style is="custom-style">

	</style>
<body>
	<dom-module id="shiny-button">
	<style>
		.button {

	}





















