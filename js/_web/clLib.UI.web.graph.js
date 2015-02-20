"use strict";

clLib.UI.web = {};

window.clEdited = false;
clLib.UI.web = {
	tableEdited : function(yesno) {
		window.clEdited = yesno;
		$(".editRelevant").prop("disabled", yesno);
	}
};