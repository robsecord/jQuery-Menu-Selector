/**
 * Menu Selector - Easy Nested Menu Selector
 * 
 * Document   : jquery.menuselector.js
 * Created on : 16-Aug-2011, 9:37 AM
 * Author     : Rob Secord
 * Description:
 *   - Provides a nested menu with nested selection capabilities
 * Dependancies:
 *   - jQuery 1.4.2 or later (http://jquery.com)
 * 
*/

(function($, undefined) {
    
    // Configuration properties
    var defaults = {
        menuSelectorJson: [],
        onLoaded: function( instance ) { return true; }
    };

    /**
     * The Menu-Selctor object.
     *
     * @constructor
     * @class menuSelector
     * @param {HTMLElement} The element to create the control for.
     * @param {Object} A set of key/value pairs to set as configuration properties.
     * @return {Object} A menuSelector object
     */
    $.menuSelector = function(element, options) {
        this.options = $.extend(true, {}, defaults, options || {});

        // Get target element
        this.menuContainer = $(element);
        this.stateClasses = ['','full','partial'];

        // Check for Valid Global Data for Menu Selector
        if (!this.options.menuSelectorJson || !this.options.menuSelectorJson.length) {
            throw new Error('Menu Selector: No Menu Item Data Found, cannot build Menu Selector HTML!');
            return;
        }
        
        // Setup all elements
        this.setup();
            
        // Call Load Callback
        this._callLoad();
    };

    // Create shortcut for internal use
    var $ms = $.menuSelector;
    $ms.fn = $ms.prototype = {menuSelector: '0.1.1'};
    $ms.fn.extend = $ms.extend = $.extend;

    $ms.fn.extend({
        
        /**
         * Sets up the Menu Selctor Elements.
         *
         * @method setup
         * @return undefined
         */
        setup: function() {
            // Get Menu Container Element
            if (this.menuContainer) {
                // Ensure Container is Empty
                this.menuContainer.empty();

                // Build Menu Items
                this.recurseMenuItemChildren(this.options.menuSelectorJson, this.menuContainer);
            }
        },
        
        /**
         * Recursively Iterates Menu Items and builds Nested Lists
         *
         * @method recurseMenuItemChildren
         * @param array menuItemChildren - An array of Data to build the Menu Items from
         * @param element menuContainer - The container to add the current list to
         * @return undefined
         */
        recurseMenuItemChildren: function( menuItemChildren, menuContainer ) {
            // Iterate Each Page item in List
            for(var i = 0, c = menuItemChildren.length; i < c; i++) {
                var pageData = menuItemChildren[i];

                // Build Menu Item Elements
                var menuItem = $('<div/>').addClass('menu-item');
                var menuItemExpander = $('<div/>').addClass('menu-item-expander').append($('<span/>').html('&nbsp;'));
                var menuItemSelection = $('<div/>').addClass('menu-item-selection').append($('<span/>').html('&nbsp;'));
                var menuItemText = $('<div/>').addClass('menu-item-text').append($('<span/>').html(pageData.name));
                var menuItemInput = $('<input/>').addClass('menu-item-input').attr({'name': 'data[AccessRights]['+pageData.id+']', 'value': '0'});
                menuItem.append(menuItemExpander, menuItemSelection, menuItemText, menuItemInput);

                // Add Menu Item to Container
                menuContainer.append(menuItem);

                // Store Data in Element
                menuItemSelection.data('pageData', pageData);

                // Store Element Internally
                pageData.elSelection = menuItemSelection;

                // Attach Click Event to Selection Element
                menuItemSelection.click(this._clickMenuSelection(this));
                
                if (pageData.state > 0) {
                    this.updateSelectionState(this.options.menuSelectorJson, menuItemSelection, pageData.id, pageData.state);
                }

                if (pageData.children.length) {
                    // Create Menu Item Contents Container for Sub-Items
                    var prefix = 'menu';
                    var menuContents = $('<div/>').addClass('menu-item-contents').attr({'id': 'menu-contents-id-' + pageData.id, 'style': 'display:none'});
                    menuItemText.attr('style', 'cursor:pointer').click(this._toggleTreeView(pageData.id));
                    menuItemExpander.attr('id', 'menu-expander-id-' + pageData.id).addClass('collapsed').click(this._toggleTreeView(pageData.id));

                    // Add Menu Contents to Container
                    menuContainer.append(menuContents);

                    // Recurse all children of Menu Item
                    this.recurseMenuItemChildren(pageData.children, menuContents);
                }
            }
        },
            
        /**
         * Changes the Selection State of Menu Items
         *
         * @method clickMenuSelection
         * @return undefined
         */
        clickMenuSelection: function(element, self) {
            var el = $(element), storedPageData = el.data('pageData'), state = storedPageData.state;

            // Rotate State
            state--; if( state < 0 ) state = (storedPageData.children.length) ? 2 : 1;
            el.data('state', state);

            // Update State of Target Element
            self.updateSelectionState(self.options.menuSelectorJson, el, storedPageData.id, state);

            // Update state of child elements
            if (storedPageData.children.length) {
                self.updateChildrenState(storedPageData.children, state);
            }

            // Update state of ancestor elements
            if (storedPageData.parentid.length) {
                self.updateAncestorState(self.options.menuSelectorJson, storedPageData);
            }
        },   
        
        /**
         * Updates the Selection State of Displayed Elements
         *
         * @method updateSelectionState
         * @param array menuItemChildren - An array of Menu Item Children
         * @param element el - The Element to Update the Display State for
         * @param number pageId - The ID of the page to Toggle Display for
         * @param number state - The State of the Menu Item
         * @return undefined
         */
        updateSelectionState: function( menuItemChildren, el, pageId, state ) {
            var i, c, stateUpdated = false;
            
            // Update Css-Class of Element
            for(i = 0; i < this.stateClasses.length; i++) {
                if (this.stateClasses[i].length) {
                    el.removeClass(this.stateClasses[i]);
                }
            }
            el.addClass(this.stateClasses[state]);
            
            // Toggle Checkbox for Item
            el.parent('.menu-item').find('input').val((state > 0) ? '1' : '0');
            
            // Iterate Each Page item in List to Find Associated Page Data
            for(i = 0, c = menuItemChildren.length; i < c; i++) {
                if (stateUpdated) return;
                
                if (menuItemChildren[i].id == pageId) {
                    menuItemChildren[i].state = state;
                    stateUpdated = true;
                } else {
                    if (menuItemChildren[i].children.length) {
                        this.updateSelectionState(menuItemChildren[i].children, el, pageId, state);
                    }
                }
            }
        },
        
        /**
         * Updates the Selection State of Displayed Child Elements
         *
         * @method updateChildrenState
         * @param array menuItemChildren - An array of Menu Item Children
         * @param number state - The State of the Menu Item
         * @return undefined
         */
        updateChildrenState: function( menuItemChildren, state ) {
            // Ignore partial state
            if (state == 2) return;

            // Iterate All Children in Menu List
            for(var j, i = 0, c = menuItemChildren.length; i < c; i++) {
                menuItemChildren[i].state = state;
                menuItemChildren[i].elSelection.data('state', state);

                // Update Css-Class of Element
                for(j = 0; j < this.stateClasses.length; j++) {
                    if (this.stateClasses[j].length) {
                        menuItemChildren[i].elSelection.removeClass(this.stateClasses[j]);
                    }
                }
                menuItemChildren[i].elSelection.addClass(this.stateClasses[state]);

                // Recurse children
                if (menuItemChildren[i].children.length) {
                    this.updateChildrenState(menuItemChildren[i].children, state);
                }
            }
        },
        
        /**
         * Updates the Selection State of Displayed Ancestor Elements
         *
         * @method updateAncestorState
         * @param array menuItemChildren - An array of Menu Item Children
         * @param object pageData - Page Data Details
         * @return undefined
         */
        updateAncestorState: function( menuItemChildren, pageData ) {
            // Get Parent Page Data
            var parentEl = this.getParentElement(menuItemChildren, pageData.parentid);
            if (!parentEl) return;

            // Get Parent Page Data
            var parentPageData = parentEl.data('pageData');

            // Check state of all children (Full, Partial, None)
            var i, c, childStateFullCount = 0, childStatePartialCount = 0;
            for(i = 0, c = parentPageData.children.length; i < c; i++) {
                if (parentPageData.children[i].state == 1) childStateFullCount++;
                if (parentPageData.children[i].state == 2) childStatePartialCount++;
            }

            // Determine New State for Ancestor Element
            var newState = 0;
            if (childStateFullCount == parentPageData.children.length) newState = 1;
            else if (childStatePartialCount > 0 || childStateFullCount > 0) newState = 2;

            // Preserve Partial States
            if (parentPageData.state == 2 && newState == 0) newState = 2;

            // Set New State
            parentPageData.state = newState;
            parentEl.data('state', newState);

            // Update Css-Class of Element
            for(i = 0; i < this.stateClasses.length; i++) {
                if (this.stateClasses[i].length) {
                    parentEl.removeClass(this.stateClasses[i]);
                }
            }
            parentEl.addClass(this.stateClasses[newState]);

            // Recurse through all ancestors
            if (parentPageData.parentid > 0) {
                this.updateAncestorState(this.options.menuSelectorJson, parentPageData);
            }
        },

        /**
         * Generate JSON Code for Menu Selections
         *
         * @method getMenuJson
         * @return json-object
         */
        getMenuJson: function() {
            return this.options.menuSelectorJson;
        },
        
        /**
         * Gets the Parent Element of ParentID from Menu Items
         *
         * @method getParentElement
         * @param array menuItemChildren - An array of Menu Item Children
         * @param number parentId - The ID of the Parent Element to get
         * @return object
         */
        getParentElement: function( menuItemChildren, parentId ) {
            // Get Parent Page Data
            var retVal = null;
            for(var i = 0, c = menuItemChildren.length; i < c; i++) {
                if (parentId == menuItemChildren[i].id) {
                    retVal = menuItemChildren[i].elSelection;
                }
                if (!retVal && menuItemChildren[i].children.length) {
                    retVal = this.getParentElement(menuItemChildren[i].children, parentId);
                }
            }
            return retVal;
        },
        
        /**
         * Checks if any Children have Active State
         *
         * @method hasActiveStateChildren
         * @param array menuItemChildren - An array of Menu Item Children
         * @param bool hasState - Active State Test
         * @return object
         */
        hasActiveStateChildren: function( menuItemChildren, hasState ) {
            if (hasState) return hasState;

            // Iterate Each Page item in List
            for(var i = 0, c = menuItemChildren.length; i < c; i++) {
                if( menuItemChildren[i].state > 0 ) hasState = true;
                if( !hasState && menuItemChildren[i].children.length )
                    hasState = this.hasActiveStateChildren(menuItemChildren[i].children, hasState);
            }
            return hasState;
        },

        /**
         * Function Closure; Toggles the Display of Tree View Children
         *
         * @method _toggleTreeView
         * @param number pageId - The ID of the page to Toggle Display for
         * @return anonymous function
         */
        _toggleTreeView: function( pageId ) {
            return function() {
                var contents = $('#menu-contents-id-' + pageId),
                    expander = $('#menu-expander-id-' + pageId);
                if (!contents.length || !expander.length) return;
                if (contents.css('display') == 'none') {
                    contents.css('display', 'block');
                    expander.removeClass('collapsed').addClass('expanded');
                } else {
                    contents.css('display', 'none');
                    expander.removeClass('expanded').addClass('collapsed');
                }
            };
        },

        /**
         * Function Closure; Click Event for Selections
         *
         * @method _clickMenuSelection
         * @return undefined
         */
        _clickMenuSelection: function(self) {
            return function() { self.clickMenuSelection(this, self); };
        },
        
        /**
         * Calls onLoaded callback function if supplied
         *
         * @method _callLoad
         * @return undefined
         */
        _callLoad: function() { 
            if (typeof this.options.onLoaded == 'function') {
                this.options.onLoaded.call(this);
            } 
        }
    });

    /**
     * Creates a Menu-Selector on all matched elements.
     *
     * @method menuSelector
     * @param options {Hash|String} A set of key/value pairs to set as configuration properties or a method name to call on a formerly created instance.
     * @return jQuery
     */
    $.fn.menuSelector = function( options ) {
        if (typeof options == 'string') {
            var instance = $(this).data('menuSelector'), args = Array.prototype.slice.call(arguments, 1);
            return instance[options].apply(instance, args);
        } else {
            return this.each(function() {
                var instance = $(this).data('menuSelector');
                if (instance) {
                    if (options) {
                        $.extend(instance.options, options);
                    }
                    instance.reload();
                } else {
                    $(this).data('menuSelector', new $ms(this, options));
                }
            });
        }
    };

})(jQuery);