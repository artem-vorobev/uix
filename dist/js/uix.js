/**
 * Uix frontend framework. Javascript functions
 * Version: 1.1.1, last update 15.07.2018
 * Author: Artem Vorobev <artem.v.mailbox@gmail.com>
 */
if (!('Uix' in window)) window.Uix = {}; (function() { "use strict";

function forceRedraw(element)
{
    element.offsetWidth;
    element.offsetHeight;
}

function fillDefaults(params, list)
{
    if (typeof params != 'object') params = {};
    for (var i=0; i<list.length; i++) switch (list[i]) {
        case 'target':
        if (typeof params.target == 'string') params.target = document.querySelector(params.target);
        break;
        case 'source':
        if (typeof params.source == 'string') params.source = document.querySelector(params.source);
        break
        case 'group':
        if (!('group' in params)) params.group = [];
        if (typeof params.group == 'string') params.group = document.querySelectorAll(params.group);
        if (typeof params.target == 'number') params.target = params.group[params.target];
        break;
        case 'duration':
        if (!('duration' in params)) params.duration = 300;
        break;
        case 'invert':
        params.invert = 'invert' in params && params.invert;
        break;
        case 'class':
        if (!('class' in params)) params['class'] = '';
        break;
        case 'hidingClass':
        if (!('hidingClass' in params)) params.hidingClass = 'hidden';
        break;
        case 'animation':
        if (!('animation' in params)) params.animation = 'default';
        break;
    }
    return params;
}


Uix.wait = function(duration) {
    return new Promise(function(then) {
        setTimeout(then, duration);
    });
}


function expandHeight(params, then)
{
    var target = params.target,
        hidingClass = params.hidingClass, 
        duration = params.duration,
        savedCss = target.style.cssText;

    if (target.offsetHeight > 0) return;

    target.classList.remove(hidingClass);

    var cs = getComputedStyle(target),
        start = {
            height: '0',
            paddingTop: '0',
            paddingBottom: '0',
            marginTop: '0',
            marginBottom: '0',
            borderTopWidth: '0',
            borderBottomWidth: '0',
            transition: 'none',
            overflow: 'hidden'
        },
        end = {
            height: cs.height,
            paddingTop: cs.paddingTop,
            paddingBottom: cs.paddingBottom,
            marginTop: cs.marginTop,
            marginBottom: cs.marginBottom,
            borderTopWidth: cs.borderTopWidth,
            borderBottomWidth: cs.borderBottomWidth,
            transition: 'all '+duration+'ms ease-in-out'
        };

    for (var prop in start) target.style[prop] = start[prop];
    forceRedraw(target);
    for (var prop in end) target.style[prop] = end[prop];

    target.dispatchEvent(new Event('beforeExpandHeight'));
    target.dispatchEvent(new Event('beforeToggleHeight'));

    setTimeout(function() {
        target.style.cssText = savedCss;
        target.dispatchEvent(new Event('afterExpandHeight'));
        target.dispatchEvent(new Event('afterToggleHeight'));
        if (typeof then == 'function') then();
    }, duration);
}


function collapseHeight(params, then)
{
    var target = params.target,
        hidingClass = params.hidingClass, 
        duration = params.duration,
        savedCss = target.style.cssText;

    if (target.offsetHeight == 0) return;

    var cs = getComputedStyle(target),
        start = {
            height: cs.height,
            paddingTop: cs.paddingTop,
            paddingBottom: cs.paddingBottom,
            marginTop: cs.marginTop,
            marginBottom: cs.marginBottom,
            borderTopWidth: cs.borderTopWidth,
            borderBottomWidth: cs.borderBottomWidth,
            overflow: 'hidden',
            transition: 'none'
        },
        end = {
            height: '0',
            paddingTop: '0',
            paddingBottom: '0',
            marginTop: '0',
            marginBottom: '0',
            borderTopWidth: '0',
            borderBottomWidth: '0',
            transition: 'all '+duration+'ms ease-in-out'
        };

    for (var prop in start) target.style[prop] = start[prop];
    forceRedraw(target);
    for (var prop in end) target.style[prop] = end[prop];

    target.dispatchEvent(new Event('beforeCollapseHeight'));
    target.dispatchEvent(new Event('beforeToggleHeight'));

    setTimeout(function() {
        target.classList.add(hidingClass);
        target.style.cssText = savedCss;
        target.dispatchEvent(new Event('afterCollapseHeight'));
        target.dispatchEvent(new Event('afterToggleHeight'));
        if (typeof then == 'function') then();
    }, duration);
}


Uix.expandHeight = function(params)
{
    params = fillDefaults(params,  ['target', 'duration', 'hidingClass']);
    return new Promise(expandHeight.bind(null, params));
}


Uix.collapseHeight = function(params)
{
    params = fillDefaults(params,  ['target', 'duration', 'hidingClass']);
    return new Promise(collapseHeight.bind(null, params));
}


Uix.toggleHeight = function(params) {
    params = fillDefaults(params,  ['group', 'target', 'invert', 'duration', 'hidingClass']);
    var group = params.group,
        target = params.target,
        invert = params.invert;

    if (group.length > 0) {
        if (invert) {
            if (target.offsetHeight > 0) {
                for (var i=0, l=group.length; i<l; i++) if (group[i] != target) {
                    expandHeight(Object.assign({}, params, {target: group[i]}));
                }
            }
            return new Promise(collapseHeight.bind(null, params));
        } else {
            if (target.offsetHeight == 0) {
                for (var i=0, l=group.length; i<l; i++) if (group[i] != target) {
                    collapseHeight(Object.assign({}, params, {target: group[i]}));
                }
            }
            return new Promise(expandHeight.bind(null, params));
        }
    } else {
        if (target.offsetHeight > 0) {
            return new Promise(collapseHeight.bind(null, params));
        } else {
            return new Promise(expandHeight.bind(null, params));
        }
    }
}


function expandWidth(params, then)
{
    var target = params.target,
        hidingClass = params.hidingClass, 
        duration = params.duration,
        savedCss = target.style.cssText;

    if (target.offsetWidth > 0) return;

    target.classList.remove(hidingClass);

    var cs = getComputedStyle(target),
        start = {
            width: '0',
            height: cs.height,
            paddingLeft: '0',
            paddingRight: '0',
            marginLeft: '0',
            marginRight: '0',
            borderLeftWidth: '0',
            borderRightWidth: '0',
            transition: 'none',
            overflow: 'hidden'
        },
        end = {
            width: cs.width,
            paddingLeft: cs.paddingLeft,
            paddingRight: cs.paddingRight,
            marginLeft: cs.marginLeft,
            marginRight: cs.marginRight,
            borderLeftWidth: cs.borderLeftWidth,
            borderRightWidth: cs.borderRightWidth,
            transition: 'all '+duration+'ms ease-in-out'
        };

    for (var prop in start) target.style[prop] = start[prop];
    forceRedraw(target);
    for (var prop in end) target.style[prop] = end[prop];

    target.dispatchEvent(new Event('beforeExpandWidth'));
    target.dispatchEvent(new Event('beforeToggleWidth'));

    setTimeout(function() {
        target.style.cssText = savedCss;
        target.dispatchEvent(new Event('afterExpandWidth'));
        target.dispatchEvent(new Event('afterToggleWidth'));
        if (typeof then == 'function') then();
    }, duration);
}


function collapseWidth(params, then)
{
    var target = params.target,
        hidingClass = params.hidingClass, 
        duration = params.duration,
        savedCss = target.style.cssText;

    if (target.offsetWidth == 0) return;

    var cs = getComputedStyle(target),
        start = {
            width: cs.width,
            height: cs.height,
            paddingLeft: cs.paddingLeft,
            paddingRight: cs.paddingRight,
            marginLeft: cs.marginLeft,
            marginRight: cs.marginRight,
            borderLeftWidth: cs.borderLeftWidth,
            borderRightWidth: cs.borderRightWidth,
            overflow: 'hidden',
            transition: 'none'
        },
        end = {
            width: '0',
            paddingLeft: '0',
            paddingRight: '0',
            marginLeft: '0',
            marginRight: '0',
            borderLeftWidth: '0',
            borderRightWidth: '0',
            transition: 'all '+duration+'ms ease-in-out'
        };

    for (var prop in start) target.style[prop] = start[prop];
    forceRedraw(target);
    for (var prop in end) target.style[prop] = end[prop];

    target.dispatchEvent(new Event('beforeCollapseWidth'));
    target.dispatchEvent(new Event('beforeToggleWidth'));

    setTimeout(function() {
        target.classList.add(hidingClass);
        target.style.cssText = savedCss;
        target.dispatchEvent(new Event('afterCollapseWidth'));
        target.dispatchEvent(new Event('afterToggleWidth'));
        if (typeof then == 'function') then();
    }, duration);
}


Uix.expandWidth = function(params)
{
    params = fillDefaults(params,  ['target', 'duration', 'hidingClass']);
    return new Promise(expandWidth.bind(null, params));
}


Uix.collapseWidth = function(params)
{
    params = fillDefaults(params,  ['target', 'duration', 'hidingClass']);
    return new Promise(collapseWidth.bind(null, params));
}


Uix.toggleWidth = function(params) {
    params = fillDefaults(params,  ['group', 'target', 'invert', 'duration', 'hidingClass']);
    var group = params.group,
        target = params.target,
        invert = params.invert;

    if (group.length > 0) {
        if (invert) {
            if (target.offsetWidth > 0) {
                for (var i=0, l=group.length; i<l; i++) if (group[i] != target) {
                    expandWidth(Object.assign({}, params, {target: group[i]}));
                }
            }
            return new Promise(collapseWidth.bind(null, params));
        } else {
            if (target.offsetWidth == 0) {
                for (var i=0, l=group.length; i<l; i++) if (group[i] != target) {
                    collapseWidth(Object.assign({}, params, {target: group[i]}));
                }
            }
            return new Promise(expandWidth.bind(null, params));
        }
    } else {
        if (target.offsetWidth > 0) {
            return new Promise(collapseWidth.bind(null, params));
        } else {
            return new Promise(expandWidth.bind(null, params));
        }
    }
}


function appear(params, then)
{
    var target = params.target,
        hidingClass = params.hidingClass, 
        duration = params.duration,
        animation = params.animation,
        savedCss = target.style.cssText;

    if (target.offsetWidth > 0 || target.offsetHeight > 0) return;

    target.classList.remove(hidingClass);

    switch (animation.toLowerCase()) {
        case 'top-to-bottom':
        case 'ttb':
        target.style.transform = 'translateY(-50vh)';
        break;
        case 'bottom-to-top':
        case 'btt':
        target.style.transform = 'translateY(50vh)';
        break;
        case 'left-to-right':
        case 'ltr':
        target.style.transform = 'translateX(-50vh)';
        break;
        case 'right-to-left':
        case 'rtl':
        target.style.transform = 'translateX(50vh)';
        break;
        case 'default':
        case 'fall':
        target.style.transform = 'scale(1.5)';
        break;
        case 'rise':
        target.style.transform = 'scale(0.66)';
        break;
    }
    target.style.opacity = '0';
    forceRedraw(target);
    target.style.transition = 'transform '+duration+'ms ease-in-out, opacity '+duration+'ms ease-in-out';
    target.style.transform = '';
    target.style.opacity = '';

    target.dispatchEvent(new Event('beforeAppear'));
    target.dispatchEvent(new Event('beforeToggleAppearance'));

    setTimeout(function() {
        target.style.cssText = savedCss;
        target.dispatchEvent(new Event('afterAppear'));
        target.dispatchEvent(new Event('afterToggleAppearance'));
        if (typeof then == 'function') then();
    }, duration);
}


function disappear(params, then)
{
    var target = params.target,
        hidingClass = params.hidingClass, 
        duration = params.duration,
        animation = params.animation,
        savedCss = target.style.cssText;

    if (target.offsetWidth == 0 && target.offsetHeight == 0) return;

    target.style.transition = 'transform '+duration+'ms ease-in-out, opacity '+duration+'ms ease-in-out';
    forceRedraw(target);

    switch (animation) {
        case 'top-to-bottom':
        case 'ttb':
        target.style.transform = 'translateY(50vh)';
        break;
        case 'bottom-to-top':
        case 'btt':
        target.style.transform = 'translateY(-50vh)';
        break;
        case 'left-to-right':
        case 'ltr':
        target.style.transform = 'translateX(50vh)';
        break;
        case 'right-to-left':
        case 'rtl':
        target.style.transform = 'translateX(-50vh)';
        break;
        case 'default':
        case 'fall':
        target.style.transform = 'scale(0.66)';
        break;
        case 'rise':
        target.style.transform = 'scale(1.5)';
        break;
    }
    target.style.opacity = '0';

    target.dispatchEvent(new Event('beforeDisappear'));
    target.dispatchEvent(new Event('beforeToggleAppearance'));

    setTimeout(function() {
        target.classList.add(hidingClass);
        target.style.cssText = savedCss;
        target.dispatchEvent(new Event('afterDisappear'));
        target.dispatchEvent(new Event('afterToggleAppearance'));
        if (typeof then == 'function') then();
    }, duration);
}


Uix.appear = function(params)
{
    params = fillDefaults(params, ['target', 'duration', 'animation', 'hidingClass']);
    return new Promise(appear.bind(null, params));
}


Uix.disappear = function(params)
{
    params = fillDefaults(params, ['target', 'duration', 'animation', 'hidingClass']);
    return new Promise(disappear.bind(null, params));
}


Uix.toggleAppearance = function(params)
{
    params = fillDefaults(params, ['target', 'group', 'duration', 'animation', 'hidingClass']);
    var group = params.group,
        duration = params.duration,
        target = params.target;

    if (group.length > 0) {
        if (target.offsetWidth == 0 && target.offsetHeight == 0) {
            var isHide = false;
            for (var i=0, l=group.length; i<l; i++) if (group[i] != target) {
                isHide = isHide || disappear(Object.assign({}, params, {target: group[i]}));
            }
            if (isHide) {
                return Uix.wait(duration).then(function() {return new Promise(appear.bind(null, params))});
            } else {
                return new Promise(appear.bind(null, params));
            }
        } else {
            return new Promise(disappear.bind(null, params));
        }
    } else {
        if (target.offsetWidth == 0 && target.offsetHeight == 0) {
            return new Promise(appear.bind(null, params));
        } else {
            return new Promise(disappear.bind(null, params));
        }
    }
}

function updateDropdownPos(target, source)
{
    var sRect = source.getBoundingClientRect(),
        tRect = target.getBoundingClientRect(),
        origin, t, l;

    if (sRect.bottom + tRect.height > window.innerHeight) {
        origin = 'bottom center';
        t = sRect.top - tRect.height;
    } else {
        origin = 'top center';
        t = sRect.bottom;
    }

    l = sRect.left + (sRect.width - tRect.width)/2;

    if (l < 0) {
        l = 0;
    } else if (l + tRect.width > window.innerWidth) {
        l = window.innerWidth - tRect.width;
    }

    target.style.top = t+'px';
    target.style.left = l+'px';
    target.style.transformOrigin = origin;
}


function drop(params, then)
{
    var target = params.target,
        hidingClass = params.hidingClass, 
        duration = params.duration,
        source = params.source,
        savedCss = target.style.cssText;

    if (target.offsetWidth > 0 || target.offsetHeight > 0) return;

    target.classList.remove(hidingClass);

    if (getComputedStyle(target).position != 'fixed') {
        target.style.setProperty('position', 'fixed', 'important');
    }

    if (target.offsetWidth < source.offsetWidth) {
        target.style.width = source.offsetWidth+'px'
    }

    target.style.zIndex = '10000';
    updateDropdownPos(target, source);    
    target.style.transform = 'scaleY(0)';
    forceRedraw(target);
    target.style.transition = 'transform '+duration+'ms ease-out';
    target.style.transform = 'scaleY(1)';
    
    target.dispatchEvent(new Event('beforeDrop'));
    setTimeout(function(){
        target.dispatchEvent(new Event('afterDrop'));
        if (typeof then == 'function') then();
    }, duration);

    const updatePos = updateDropdownPos.bind(null, target, source);

    const hideDropdown = function() {
        target.style.transition = 'opacity '+duration+'ms ease';
        forceRedraw(target);
        target.style.opacity = '0';
        target.dispatchEvent(new Event('beforeUndrop'));

        setTimeout(function(){
            target.style.cssText = savedCss;
            target.classList.add(hidingClass);
            target.dispatchEvent(new Event('afterUndrop'));
        }, duration);

        document.body.removeEventListener('click', hideDropdown, true);
        window.removeEventListener('resize', updatePos);
        window.removeEventListener('scroll', updatePos, true);
    }

    document.body.addEventListener('click', hideDropdown, true);
    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, true);
}

Uix.drop = function(params)
{
    params = fillDefaults(params, ['target', 'source', 'duration', 'hidingClass']);
    return new Promise(drop.bind(null, params));
}

Uix.toggleClass = function(params) {
    params = fillDefaults(params, ['target', 'group', 'duration', 'class', 'invert']);
    var cls     = params['class'],
        group   = params.group,
        target  = params.target;

    if (group.length > 0) {
        if (params.invert) {
            target.classList.remove(cls);
            for (var i=0, l=group.length; i<l; i++) if (group[i] != target) group[i].classList.add(cls);
        } else {
            target.classList.add(cls);
            for (var i=0, l=group.length; i<l; i++) if (group[i] != target) group[i].classList.remove(cls);
        }
    } else {
        target.classList.toggle(cls);
    }

    return Uix.wait(params.duration); 
}

Uix.tab = function(btn, n) {
    Uix.toggleClass({target:n, group:btn.parentNode.children, 'class':'active'});
    Uix.toggleClass({target:n, group:btn.parentNode.nextElementSibling.children, 'class':'hidden', invert:true});
}


})();