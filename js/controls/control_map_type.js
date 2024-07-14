'use strict';

export var ControlMapType = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.id = 'location-lookup';
        container.style.background = 'none';
        container.style.fontSize = '16px';
        container.style.width = '180px';
        container.style.height = 'auto';
        L.DomEvent.disableClickPropagation(container);

        var dropdown = L.DomUtil.create('select', 'leaflet-bar leaflet-control leaflet-control-custom dropdown-dark', container);

        var option1 = L.DomUtil.create('option', '', dropdown);
        option1.value = 'normal';
        option1.text = 'Normal View';

        var option2 = L.DomUtil.create('option', '', dropdown);
        option2.value = 'objects';
        option2.text = 'Object View';

        var option2 = L.DomUtil.create('option', '', dropdown);
        option2.value = 'height';
        option2.text = 'Height Map';

        L.DomEvent.on(dropdown, 'change', (e) => this._onDropdownChange(e, map), this);

        return container;
    },

    _onDropdownChange: function(e, map) {
        console.log('Selected value:', e.target.value);
        this._map.mapType = e.target.value
        this._map.updateMapPath();
    }
});