var lat,
    lon,
    latID,
    longID,
    featureID;
var features = [];

function _setID(data) {
    $.each(data.addressPointsService.features, function (i, result) {
        // set the id
        lat = result.geometry.coordinates[1];
        lon = result.geometry.coordinates[0];
        latID = lat.toString().replace('.', '').replace('-', '');
        lonID = lon.toString().replace('.', '').replace('-', '');
        featureID = latID + lonID;
        result.properties.id = featureID;

        // add the service
        // needed to output address correctly
        result.properties.service = 'point';

        // add to features array
        features.push(result);
    });

    $.each(data.censusService.features, function (i, result) {
        // set the id
        lat = result.geometry.coordinates[1];
        lon = result.geometry.coordinates[0];
        latID = lat.toString().replace('.', '').replace('-', '');
        lonID = lon.toString().replace('.', '').replace('-', '');
        featureID = latID + lonID;
        result.properties.id = featureID;

        // add the service
        // needed to output address correctly
        result.properties.service = 'census';

        // add to features array
        features.push(result);
    });

    // return the new array
    return features;
}

module.exports = function(address) {
    features = [];
    var geodata;
    var newadd = address.replace(/ /g, '+');
    $.ajax({
        url: '/api/geocode/' + newadd,
        method: "GET",
        dataType: "json",
        async: false
    }).done(function(data) {
        geodata = _setID(data);
        console.log(geodata);
    }).error(function(request, status, error) {
        console.log(status + ' and ' + error);
        console.log(request);
        geodata = request.status;
    });

    /*
    // can use this as a response and comment out the ajax call
    var data = $.parseJSON('[{"type": "Feature","geometry": {"type": "Point", "coordinates": [-94.01536909650383, 36.17558950466898, 0.0] }, "properties": { "address": "20779 Lakeshore Springdale AR 72764", "alt_address": "", "load_date": 1428674694900 }}]');
    var geodata = _setID(data);
    */
    return geodata;
}