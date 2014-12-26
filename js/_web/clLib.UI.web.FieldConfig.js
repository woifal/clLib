"use strict";

clLib.webFieldConfig = {
	FieldConfigError: function (message) {
	  this.name = 'FieldConfigError';
	  this.message = message || 'Unknown reason';
	  alert("FieldConfigError " + JSON.stringify(this.message));
	  this.prototype = new Error();
	  this.prototype.constructor = clLib.UI.fc.FieldConfigError;
	}
	,FieldConfigCollection : function(collectionName) {
		this.fieldConfigs = {};
		this.add = function(fieldConfigObj) {
			if(!(fieldConfigObj instanceof clLib.webFieldConfig.FieldConfig)) {
				throw new clLib.UI.fc.FieldConfigError("trying to add invalid FieldConfig object.");
			}
			this.fieldConfigs[fieldConfigObj.fieldName] = fieldConfigObj;
		}
		this.get = function(fieldName) {
			if(!this.fieldConfigs[fieldName]) {
				alert("field >" + fieldName + "< not found in collection.");
				return {};
				//throw new clLib.UI.web.FieldConfigError("field >" + fieldName + "< not found in collection.");
			}
			return this.fieldConfigs[fieldName].config;
		}
		this.fields = function() {
			return Object.keys(this.fieldConfigs);
		}
	}
	,FieldConfig : function(fieldConfig) {
		//alert("building field with config " + JSON.stringify(fieldConfig));
		this.fieldName = fieldConfig["fieldName"];
		this.defaults = {
			fieldName : this.fieldName
			,displayName : this.fieldName
			,orderable : true
			,renderFunc : function(value) { return value; }
			,editElement : {
				serialize: function($editEl) {
					console.log("(" + this.fieldName + ") the editEl is >" + $editEl + "<");
					return $editEl.find("select").val();
				}
				,create: function(colName, currentValue, $thead) {
					//alert("(" + this.fieldName + ") creating >" + colName + "< with value >" + currentValue + "<");
					return $thead
						.find("tr th." + colName + " select")
						.clone()
						.val(currentValue)
				}
			}
			,filterElement: function(column, api, i) {
				console.log("adding filter select..");
				var foo = $('<br>').appendTo( $(column.header()) );
				var select = $('<select><option style="text-align: center;" value="">-- All --</option></select>')
					.appendTo( $(column.header()) )
					.on( 'change', function () {
						console.log("filtering on >" + this.value + "<");
						console.log("Changed >" + i + "< >" + $(this).parent().index() + "< >" + column.header() + "<>" + $(column.header()).attr("class") + "<!!!");

						api
							.column( $(this).parent().index()+':visible' )
							.search( this.value )
							.draw();
					} )
					.on('click', function(evt) {
						console.log("clicked!!" + evt.target);
						evt.stopImmediatePropagation();
					})
				;
 
				column.data().unique().sort().each( function ( d, j ) {
					if(d != "") {
						var renderedValue = d;
						if(this.renderFunc) {
							renderedValue = this.renderFunc(d);
						}
						var asdf = '<option '
							+ ' value="' + d +'">'
							+ d
							+ '</option>'
						;
						//console.log(asdf);
						select.append( asdf )
					}
				} );

			}

		}
		
		this.config = this.defaults;
		this.config = $.extend(true, this.config, fieldConfig);
		this.config.editElement.serialize = this.config.editElement.serialize.bind(this);
		this.config.editElement.create = this.config.editElement.create.bind(this);

	}
};
