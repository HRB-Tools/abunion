var min1 = [], min2 = [], resArr = [], sumArr = [], senarr = [], offen = [];
function sena(temp1, min1){
    min1.push([temp1[1][6]+temp1[1][7],temp1[1][4],temp1[1][16],temp1[1][3],temp1[1][9],1]);
	for ( var i = 9;i < temp1.length - 4;i++ ) {
		min1.push([temp1[i][6]+temp1[i][7],temp1[i][4],temp1[i][16],temp1[i][3],temp1[i][9],i]);
		min1[i-9][0].slice(1);
		min1[i-9][0] = min1[i-9][0].replace(/[^0-9.,]/g, '');
	}
};
function opos(temp2, min2){
    console.log(temp2);
	for ( var i = 9;i < temp2.length - 1;i++ ) {
		min2.push([temp2[i][6].slice(1),temp2[i][3],temp2[i][2],temp2[i][1],i]);
	}
};
function and(arr1, arr2, sumArr){
    sumArr = [];
	for ( var i = 1;i < arr1.length;i++){
		for(var j = 0;j < arr2.length;j++){
		    // arr1[i] = arr1[i].replace(/[^0-9.,]/g, '');
		    // arr2[j] = arr2[j].replace(/[^0-9.,]/g, '');
			if ( arr1[i][0].replace(/[^0-9.,]/g, '') == arr2[j][0].replace(/[^0-9.,]/g, '') ){
                arr2[j][1] = changefmt(arr2[j][1]);
			    if ( idA(arr1[i]) == idA(arr2[j])){
                     // console.log(senarr[arr1[i][5]]);
                     // console.log(offen[arr2[j][4]]);
                    console.log(arr1[i]);
                    console.log(arr2[j]);
                    console.log(idA(arr1[i]) + ' ' + idA(arr2[j]));
                    senarr.splice(arr1[i][5],1,null);
                    offen.splice(arr2[j][4],1,null);
                }
				sumArr.push(arr1[i]);
				sumArr.push(arr2[j]);
			}
		}
	}
	for ( let k = 0; k < senarr.length; k++ ){
	    if ( senarr[k] == null ){
	        senarr.splice(k,1);
	        k--;
        }
    }
    for ( let k = 0; k < offen.length; k++ ){
        if ( offen[k] == null ){
            offen.splice(k,1);
            k--;
        }
    }
	return sumArr;
}
function changefmt(a){
    let mmddyyyy = a.split('\/');
    var dd = '0' + mmddyyyy[1], mm = '0' + mmddyyyy[0];
    let ddmmyyyy = [dd.slice(1), mm.slice(1), mmddyyyy[2]];
    return ddmmyyyy.join('.');
}
var comp = document.querySelector('#comp');
comp.addEventListener('mousedown', function(){
	feed(and(min1, min2, sumArr));
	console.log(resArr.length);
	arrayFinder();
});
function idA(arr){
    let betrag = document.querySelector('#betrag').checked,  rechnungsnr = document.querySelector('#rechnungsnr').checked, buchungstext = document.querySelector('#buchungstext').checked, datum = document.querySelector('#datum').checked;
    var identity = '';
    if ( betrag === false &&
        rechnungsnr === false &&
        buchungstext === false &&
        datum === false ) {
        return true;
    }
    {
        var c = 0;
        if ( betrag && arr[c] != undefined) {
            identity += arr[c].replace(/[^0-9.,]/g, '') + '-';
        }
        c++;
        if ( datum && arr[c] != undefined) {
            identity += arr[c].replace(/[^0-9.,/]/g, '') + '-';
        }
        c++;
        if ( rechnungsnr  && arr[c] != undefined) {
            identity += arr[c].replace(/[^0-9.,]/g, '') + '-';
        }
        c++;
        if ( buchungstext  && arr[c] != undefined) {
            identity += arr[c].replace(/[^0-9.,]/g, '') + '-';
        }
    }
    return identity;
}
function feed(sumArr){
    resArr = [];
	for ( var i = 0;i < sumArr.length-1;i+=2 ) {
		if ( idA(sumArr[i]) == idA(sumArr[i+1]) ){
            senarr.splice(sumArr[i][6],1,null);
            resArr.push(sumArr[i]);
			resArr.push(sumArr[i+1]);
		}
	}
}
function csvify(arr2D, semicolon){
    /* converts a twodimensional array into a crlf-indented semicolon csv-file */
    let rawtext = '';
    for ( var i = 0; i < arr2D.length; i++ ) {
        let row = '';
        if (arr2D[i] != null) for ( let j = 0; j < arr2D[i].length; j++ ) {
            row += semicolon ? arr2D[i][j] + ';' : arr2D[i][j] + ',';
        }
        rawtext += row + '\r\n' ;
    }
    return rawtext;
}
function saveCSV(b){
    let a = csvify(b, true);
    var arrBlob = new Blob([a], {type: 'text/csv'});
    console.log("saveCSV, arrBlob: " + arrBlob);
    var url = URL.createObjectURL(arrBlob);
    var link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Export.csv');
    link.click();
}
function init(){
	var fi = document.querySelector('#fileinput');
	var reader1 = new FileReader();
	fi.addEventListener('change', function(){reader1.readAsText(this.files[0])});
	reader1.addEventListener('loadend', function(){
		var arr = this.result;
		var rows = arr.split('\n');
		var csv = [];
		for (var i = 0;i < rows.length;i++){
			csv.push(rows[i].split(';'));
			senarr.push(rows[i].split(';'))
		}
		sena(csv, min1);
	});
	var fi2 = document.querySelector('#fileinput2');
	var reader2 = new FileReader();
	fi2.addEventListener('change', function(){reader2.readAsText(this.files[0])});
	reader2.addEventListener('loadend', function(){
		var arr = this.result;
		var rows = arr.split('\n');
		var csv = [];
		for (var i = 0;i < rows.length;i++){
			csv.push(rows[i].split(';'));
            offen.push(rows[i].split(';'));
		}
		opos(csv, min2);
	});
	var se = document.querySelector('#sena')
	se.addEventListener('mousedown', function(){
		fi.click()
	});
	var op = document.querySelector('#opos')
	op.addEventListener('mousedown', function(){
		fi2.click()
	});
    document.querySelector('#dl').addEventListener('mousedown', function(){saveCSV(currentSelection());});
    document.querySelector('#kl').addEventListener('mousedown', function(){saveCSV(senarr);});
}
document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        document.querySelector('#filt').addEventListener('mousedown', function(){
            if ( document.querySelector('.dropdown-content').style.display === 'block' ) {
                document.querySelector('.dropdown-content').style.display = 'none';
            }
            else {
                document.querySelector('.dropdown-content').style.display = 'block'
            }
        });
        init();
    }
}
/* unimportant stuff */
function arrayFinder(){
    var rad = document.querySelector('#radio');
    rad.style.display = 'block';
    for ( var i in window ) {
        if ( window[i] != null ){
            if (typeof(window[i]) === 'object'){
                if (window[i].length > 0){
                    var inp = document.createElement('input');
                    inp.setAttribute('type', 'radio');
                    inp.setAttribute('id', i);
                    inp.setAttribute('value', i);
                    inp.setAttribute('name', 'arrayVar');
                    var lab = document.createElement('label');
                    lab.setAttribute('for', i);
                    lab.innerHTML = i;
                    rad.appendChild(inp);
                    rad.appendChild(lab);
                }
            }
        }
    }
}
function currentSelection(){
    var radios = document.querySelectorAll('#radio *');
    for ( var i = 0; i < radios.length; i++) if (radio[i].checked) return window[radio[i].value];
}
/* function cemetery */
function arrToTable(arr){
    var table = document.createElement('table');
    for ( var i = 0;i < arr.length;i++ ){
        var el = document.createElement('tr');
        for ( var j = 0;j < arr[i].length;j++ ){
            var cell = document.createElement('td');
            cell.innerHTML = arr[i][j];
            el.appendChild(cell);
        }
        table.appendChild(el);
    }
    document.body.appendChild(table);
}