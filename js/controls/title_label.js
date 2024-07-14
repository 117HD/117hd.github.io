'use strict';

export var TitleLabel = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div');
        container.id = 'titleLabel';
        container.href = 'https://github.com/117HD/RLHD';
        container.innerHTML = "<span id='explv'>117HD</span>'s Map";

        L.DomEvent.disableClickPropagation(container);
        return container;
    }
});