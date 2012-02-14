/*
 * Author: Robert J. Secord, B.Sc.
 */

(function($, undefined) {
    
    var data = [
        {'id':  'PERM_1', 'parentid': '', 'name': 'Permission Set 1', 'state': 1, 'children': []},
        {'id':  'PERM_2', 'parentid': '', 'name': 'Permission Set 2', 'state': 2, 'children': []},
        {'id':  'PERM_3', 'parentid': '', 'name': 'Permission Set 3', 'state': 0, 'children': [
            {'id':  'PERM_31', 'parentid': 'PERM_3', 'name': 'Permission Set 31', 'state': 0, 'children': []},
            {'id':  'PERM_32', 'parentid': 'PERM_3', 'name': 'Permission Set 32', 'state': 0, 'children': []},
            {'id':  'PERM_33', 'parentid': 'PERM_3', 'name': 'Permission Set 33', 'state': 0, 'children': []},
            {'id':  'PERM_34', 'parentid': 'PERM_3', 'name': 'Permission Set 34', 'state': 0, 'children': []},
            {'id':  'PERM_35', 'parentid': 'PERM_3', 'name': 'Permission Set 35', 'state': 0, 'children': []},
            {'id':  'PERM_36', 'parentid': 'PERM_3', 'name': 'Permission Set 36', 'state': 0, 'children': []}
        ]},
        {'id':  'PERM_4', 'parentid': '', 'name': 'Permission Set 4', 'state': 0, 'children': []},
        {'id':  'PERM_5', 'parentid': '', 'name': 'Permission Set 5', 'state': 0, 'children': []},
        {'id':  'PERM_6', 'parentid': '', 'name': 'Permission Set 6', 'state': 0, 'children': [
            {'id':  'PERM_61', 'parentid': 'PERM_6', 'name': 'Permission Set 61', 'state': 0, 'children': []},
            {'id':  'PERM_62', 'parentid': 'PERM_6', 'name': 'Permission Set 62', 'state': 0, 'children': []},
            {'id':  'PERM_63', 'parentid': 'PERM_6', 'name': 'Permission Set 63', 'state': 0, 'children': [
                {'id':  'PERM_631', 'parentid': 'PERM_63', 'name': 'Permission Set 631', 'state': 0, 'children': []},
                {'id':  'PERM_632', 'parentid': 'PERM_63', 'name': 'Permission Set 632', 'state': 0, 'children': []},
                {'id':  'PERM_633', 'parentid': 'PERM_63', 'name': 'Permission Set 633', 'state': 0, 'children': []}
            ]},
            {'id':  'PERM_64', 'parentid': 'PERM_6', 'name': 'Permission Set 64', 'state': 0, 'children': []},
            {'id':  'PERM_65', 'parentid': 'PERM_6', 'name': 'Permission Set 65', 'state': 0, 'children': []},
            {'id':  'PERM_66', 'parentid': 'PERM_6', 'name': 'Permission Set 66', 'state': 0, 'children': []}
        ]},
        {'id':  'PERM_7', 'parentid': '', 'name': 'Permission Set 7', 'state': 0, 'children': [
            {'id':  'PERM_71', 'parentid': 'PERM_7', 'name': 'Permission Set 71', 'state': 0, 'children': []},
            {'id':  'PERM_72', 'parentid': 'PERM_7', 'name': 'Permission Set 72', 'state': 0, 'children': []},
            {'id':  'PERM_73', 'parentid': 'PERM_7', 'name': 'Permission Set 73', 'state': 0, 'children': []}
        ]},
        {'id':  'PERM_8', 'parentid': '', 'name': 'Permission Set 8', 'state': 0, 'children': []},
        {'id':  'PERM_9', 'parentid': '', 'name': 'Permission Set 9', 'state': 0, 'children': []}
    ];
    
    var g_menuSelector = $('#menuOptions').menuSelector({
        menuSelectorJson: data,
        onLoaded: function() {
        }
    });
    
    $('#cmdJsonId').click(function() {
        log($('#menuOptions').menuSelector('getMenuJson'));
    });

})(jQuery);
