/*
	Version : 1
	Auteur : BRE Maxime
	Date : 12/02/11
	Contact : macsou@gmail.com
	
	Bugs connus :
	 - Ne g�re pas la propri�t� CSS clip.
	 - Ne g�re pas la propri�t� CSS position avec la valeur fixed pour l'image.
	 - Ne g�re pas la propri�t� CSS overflow pour un objet englobant l'image.
	 
	A faire :
	 - R�gler les bugs ci-dessus.
	 - Afficher r�ellement la bordure des zones area (des cercles ou des polygones au lieu de simples rectangles).
*/

/*
	Cette classe permet de mettre en �vidence des zones area d'une map HTML.
	Param�tres :
	 - _img : Objet Image repr�sentant l'image dont on veut mettre en �vidence les zones r�actives.
	 - _persistent : Bool�en permettant de dire si les rectangles de mise en �vidence doivent dispara�tre quand le pointeur n'est plus sur eux.
	 - _direct : Bool�en permettant de dire si les rectangles de mise en �vidence doivent appara�tre directement ou bien lors du passage de la souris sur la zone.
	 - _resize : Bool�en permettant de dire si les rectangles de mise en �vidence doivent s'adapter � un �ventuellement changement de taille de l'image.
*/
function MapHighlight(_img, _persistent, _direct, _resize) {
	var img = _img;
	var persistent = _persistent;
	var direct = _direct;
	var resize = _resize;
	var obj = this;
	var timer = 0;
	var rectsContainer = document.createElement('div');
	rectsContainer.id="container"
	rectsContainer.style.position = 'absolute';
	rectsContainer.style.left = rectsContainer.style.top = '0px';
	document.body.appendChild(rectsContainer);
	
	/*
	========================================================================
	=========================== M�thodes priv�es ===========================
	========================================================================
	*/
	
	/*
		Permet de trouver la map associ�e � une image.
		Param�tres :
		 - img : L'image dont on veut conna�tre la map associ�e.
	*/
	var findMap = function(img) {
		var maps = document.getElementsByTagName('map');
		for(var i = 0; i < maps.length; i++) {
			if(maps[i].getAttribute('name') == img.getAttribute('usemap').replace('#', '')) {
				return maps[i];
			}
		}
		return 0;
	}
	
	/*
		Permet de supprimer tous les rectangles de mise en �vidence et l'interaction de toutes les zones area d'une map.
		Param�tres :
		 - map : La map que l'on veut nettoyer.
	*/
	var clearMap = function(map) {
		var as = rectsContainer.getElementsByTagName('a');
		var l = as.length;
		for(var i = 0; i < l; i++) {
			rectsContainer.removeChild(as[0]);
		}
		var areas = map.getElementsByTagName('area');
		for(var i = 0; i < areas.length; i++) {
			areas[i].onmouseover = function() {};
		}
	}
			
	/*
		Renvoie la position absolue d'un objet.
		Param�tres :
		 - obj : Objet HTML dont on veut conna�tre la position absolue.
	*/
	var findPos = function(obj) {
		var l = t = 0;
		if(obj.offsetParent) {
			do {
				l += obj.offsetLeft;
				t += obj.offsetTop;
			} while(obj = obj.offsetParent);
		}
		return [l, t];
	}
	
	/*
		Cr�e un rectangle qui dispara�t quand on d�place la souris hors de lui.
		Param�tres :
		 - area : Objet HTML repr�sentant la zone area associ�e au rectangle � cr�er.
	*/
	var createRect = function(area) {
		var dim = coordsToDim(area.coords, area.shape);
		for(var i = 0; i < dim.length; i++) {
			if(dim[i] == 'Infinity' || isNaN(dim[i])) {
				return;
			}
		}
		var rect = document.createElement('a');
		for(var i = 0; i < area.attributes.length; i++) {
			if(area.attributes[i].name != 'coords' && area.attributes[i].name != 'shape') {
				rect.setAttribute(area.attributes[i].name, area.getAttribute(area.attributes[i].name));
				rect.id = rect.id.substring(1) ;
			}
		}
		rect.style.cssText += area.style.cssText;
		rect.style.position = 'absolute';
		rect.style.left = dim[0] + 'px';
		rect.style.top = dim[1] + 'px';
		rect.style.width = dim[2] + 'px';
		rect.style.height = dim[3] + 'px';
		rect.style.backgroundImage = 'url(foo.gif)'; //Important pour IE.
		rectsContainer.appendChild(rect);
		area.style.visibility = 'hidden'; //Important pour IE.
		rect.style.visibility = 'visible'; //Important pour IE.
		if(!persistent) {
			rect.onmouseout = function() {
				rectsContainer.removeChild(this);
			}
		}
	}
	
	/*
		Renvoie les dimensions d'un polygne (position coin haut gauche et position coin bas droite).
		Param�tres :
		 - coords : Tableau d'entier repr�sentant les coordonn�es du polygone.
	*/
	var dimPoly = function(coords) {
		var minT, minL, maxT, maxL;
		minL = maxL = coords[0];
		minT = maxT = coords[1];		
		for(var i = 0; i < coords.length; i++) {
			if(i % 2 == 0) {
				if(coords[i] < minL) {
					minL = coords[i];
				}
				if(coords[i] > maxL) {
					maxL = coords[i];
				}
			} else {
				if(coords[i] < minT) {
					minT = coords[i];
				}
				if(coords[i] > maxT) {
					maxT = coords[i];
				}
			}
		}
		return [minL, minT, maxL, maxT];
	}
	
	/*
		Renvoie l'�paisseur de la bordure d'une image.
		Param�tres :
		 - img : L'image dont on veut conna�tre l'�paisseur de la bordure.
	*/
	var getBorderWidth = function(img) {
		var width = img.offsetWidth;
		var bwTmp = img.style.borderWidth;
		img.style.borderWidth = '0px';
		var nWidth = img.offsetWidth;
		var bw = width - nWidth;
		img.style.borderWidth = bwTmp;
		return bw / 2;
	}
	
	/*
		Renvoie la hauteur naturelle (v�ritable) de l'image img.
		Param�tres :
		 - img : L'image dont on veut conna�tre la hauteur naturelle.
	*/
	var getNaturalHeight = function(img){
		if(typeof img.naturalHeight == "undefined") {
			var tmp = new Image();
			tmp.src = img.src;
			return tmp.height;
		} else {
			return img.naturalHeight;
		}
	}
	
	/*
		Renvoie la largeur naturelle (v�ritable) de l'image img.
		Param�tres :
		 - img : L'image dont on veut conna�tre la largeur naturelle.
	*/
	var getNaturalWidth = function(img){
		if(typeof img.naturalWidth == "undefined") {
			var tmp = new Image();
			tmp.src = img.src;
			return tmp.width;
		} else {
			return img.naturalWidth;
		}
	}

	
	/*
		Renvoie les dimensions (top, left, width, height) d'une zon area en fonction de son type et de ses coordonn�es.
		Param�tres :
		 - coordsStr : Cha�ne de caract�res repr�sentant les coordonn�es de la zone area.
		 - shape : Cha�ne de caract�res repr�sentant le type de la zone area.
	*/
	var coordsToDim = function(coordsStr, shape) {
		var mapPos = findPos(img);
		var coords = coordsStr.replace(/ /g, '').split(',');
		for(var j = 0; j < coords.length; j++) {
			coords[j] = parseInt(coords[j], 10);
		}
		var t, l, w, h;
		if(shape == 'rect') {
			l = coords[0] + mapPos[0];
			t = coords[1] + mapPos[1];
			w = coords[2] - coords[0];
			h = coords[3] - coords[1];
		} else if(shape == 'circle') {
			l = coords[0] - coords[2] + mapPos[0];
			t = coords[1] - coords[2] + mapPos[1];
			w = 2 * coords[2];
			h = 2 * coords[2];
		} else if(shape == 'poly') {
			var dim = dimPoly(coords);
			l = dim[0] + mapPos[0];
			t = dim[1] + mapPos[1];
			w = dim[2] - dim[0];
			h = dim[3] - dim[1];
		} else {
			t = l = w = h = 0;
		}
		var bw = getBorderWidth(img);
		if(resize) {
			//Calculs dans le cas o� l'image est redimensionn�e.
			var ratioW = (getNaturalWidth(img)) / (img.offsetWidth - 2 * bw);
			var ratioH = (getNaturalHeight(img)) / (img.offsetHeight - 2 * bw);
			var diffL = l - mapPos[0] + bw * ratioW;
			var diffT = t - mapPos[1] + bw * ratioH;
			l = Math.round(diffL / ratioW + mapPos[0]);
			t = Math.round(diffT / ratioH + mapPos[1]);
			w = Math.round(w / ratioW);
			h = Math.round(h / ratioH);
		} else {
			l += bw;
			t += bw;
		}
		return [l, t, w, h];
	}

	/*
		Permet de mettre � jour les rectangles de mise en �vidence � chaque d�placement de l'image associ�e.
	*/
	var initInterval = function() {
		var pos = findPos(img);
		timer = setInterval(function() {
			var pos2 = findPos(img);
			if(pos[0] != pos2[0] || pos[1] != pos2[1]) {
				obj.update();
				pos = pos2;
			}
		}, 100);
	}
	
	/*
	========================================================================
	========================== M�thodes publiques ==========================
	========================================================================
	*/
	
	/*
		Permet de mettre en place la mise en �vidence de toutes les zones area de l'image concern�e.
	*/
	this.highlight = function() {
		var map = findMap(img);
		if(map == 0) return;
		if(timer == 0) {
			initInterval();
		}
		map.style.display = 'none' //Important pour IE.
		var areas = map.getElementsByTagName('area');
		for(var i = 0; i < areas.length; i++) {
			if(direct) {
				createRect(areas[i]);
			} else {
				areas[i].onmouseover = function() {
					createRect(this);
				}
			}
		}
	}
	
	/*
		Permet de renseigner une nouvelle valeur pour la variable img.
		Param�tres :
		 - _img : Objet Image repr�sentant la nouvelle valeur de la variable img.
	*/
	this.setImg = function(_img) {
		clearMap(findMap(img));
		img = _img;
	}

	/*
		Permet de renseigner une nouvelle valeur pour la variable persistent.
		Param�tres :
		 - _persistent : Bool�en repr�sentant la nouvelle valeur de la variable persistent.
	*/
	this.setPersistent = function(_persistent) {
		persistent = _persistent;
	}

	/*
		Permet de renseigner une nouvelle valeur pour la variable direct.
		Param�tres :
		 - _direct : Bool�en repr�sentant la nouvelle valeur de la variable direct.
	*/
	this.setDirect = function(_direct) {
		direct = _direct;
	}

	/*
		Permet de renseigner une nouvelle valeur pour la variable resize.
		Param�tres :
		 - _resize : Bool�en repr�sentant la nouvelle valeur de la variable resize.
	*/
	this.setResize = function(_resize) {
		resize = _resize;
	}
	
	/*
		Permet de mettre � jour les rectangles de mise en �vidence.
	*/
	this.update = function() {
		clearMap(findMap(img));
		this.highlight();
	}
	
	/*
		Permet de supprimer la mise en �vidence sur l'image courante.
	*/
	this.destroy = function() {
		clearMap(findMap(img));
		clearInterval(timer);
		timer = 0;
	}
}