/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

let jsdom = require("jsdom");

global.window = new jsdom.JSDOM().window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.CustomEvent = require("custom-event");

let Vue = require("vue"),
    Overlay = require("../dist/vuejs-overlay.min");


Vue.use(Overlay);

describe('Vue.overlay', function () {
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

    it('Overlay', () => {
        // TODO: Add DOM object for test overlay
    });
});