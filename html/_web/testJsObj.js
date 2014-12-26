<html>
<script>
function FieldConfig(fieldConfig) {
    this.fieldName = fieldConfig["fieldName"];
    alert("this.fieldName is " + this.fieldName);
    this.defaults = {
        editElement : {
            serialize: function($editEl) {
                alert("(" + this.fieldName + ") the editEl is >" + $editEl + "<");
            }
            ,create: function(colName, currentValue) {
                alert("(" + this.fieldName + ") creating >" + colName + "< with value >" + currentValue + "<");
            }
        }
    };
    
    this.editElement = $.extend(true, fieldConfig["editElement"], this.defaults.editElement);
};

var fieldA = new FieldConfig({fieldName : "fieldA"});
var fieldB = new FieldConfig({
    fieldName : "fieldB"
    ,editElement : {
        serialize : function($editEl) {
            alert("(" + this.fieldName + ") Customer serialize for >" + $editEl + "<");
        }
    }
});

fieldA.editElement.serialize("somefieldA..");
fieldA.editElement.create("someColA..", "xyz");
fieldB.editElement.serialize("somefieldB..");
fieldB.editElement.create("someColB..", "xyz");
</script>
</html>