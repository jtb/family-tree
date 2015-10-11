function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function dec2bin(str){
    var dec = parseInt(str, 10);
    return (dec >>> 0).toString(2);
}

function parentExists(json, i) {
    if (typeof json === 'undefined') return false;
    if (typeof json.parents === 'undefined') return false;
    return (typeof json.parents[i] !== 'undefined');
}

function findRoot(param, root) {
    if (param === "" || param === "0") return root;
    var s = dec2bin(param);
    if (isNaN(s) || s.length < 2) return root;

    var json = root;
    for (var i = 1; i < s.length; i++) {
        if (s.charAt(i) == '0' && parentExists(json, 0) && json.parents[0].male) {
            json = json.parents[0];
            continue;
        }
        if (s.charAt(i) == '0' && parentExists(json, 1) && json.parents[1].male) {
            json = json.parents[1];
            continue;
        }
        if (s.charAt(i) == '1' && parentExists(json, 0) && !json.parents[0].male) {
            json = json.parents[0];
            continue;
        }
        if (s.charAt(i) == '1' && parentExists(json, 1) && !json.parents[1].male) {
            json = json.parents[1];
            continue;
        }
        // cannont continue so I should bail;                                                                                                             
        return root;
    }
    return json;
}
