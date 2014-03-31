




/*
<div data-role="collapsible" data-theme="b" data-content-theme="d" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-inset="false">
							<h2>Pets</h2>
							<ul data-role="listview">
								<li><a href="index.html">Canary</a></li>
								<li><a href="index.html">Cat</a></li>
								<li><a href="index.html">Dog</a></li>
								<li><a href="index.html">Gerbil</a></li>
								<li><a href="index.html">Iguana</a></li>
								<li><a href="index.html">Mouse</a></li>
							</ul>
						</div><!-- /collapsible -->
*/
clLib.populateListViewCollapsible = function($listDiv, dataObj, collapsedKey){
	var $baseItem = $listDiv.children().first().clone();
	alert($baseItem.html());
	$listDiv.empty();
	$.each(dataObj, function(index, value) {
		var itemValue;
		itemValue = dataObj[collapsedKey];
		
		var $collapsibleItem = $("<div></div>");
		$collapsibleItem
			.data("data-role", "collapsible")
			.data("data-inset", "false")
			// data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d" data-inset="false"
			;
		$collapsibleItem = $baseItem.clone();
		$collapsibleItem.append("<h2></h2>")
			.html(itemValue);
		
		var $collapsibleList = $("<ul></ul>");
		$collapsibleList
			.data("data-role", "listview")
		;
		
		$.each(value, function(index2, value2) {
			alert(index2 + "-" + value2);
			var $listItem = $('<li></li>')
					.html(value2);
			$collapsibleList.append($listItem);
		});
		
		
		
		$collapsibleItem.append($collapsibleList);
		
		//$collapsibleList.listview();


		$collapsibleList.trigger("create");

		$listDiv.append($baseItem);

		//$listDiv.append($collapsibleList);
	});
	// $listDiv.trigger("create");

};









/*
<li data-role="list-divider">Friday, October 8, 2010 <span class="ui-li-count">2</span></li>
			<li><a href="index.html">
				
					<h3>Stephen Weber</h3>
					<p><strong>You've been invited to a meeting at Filament Group in Boston, MA</strong></p>
					<p>Hey Stephen, if you're available at 10am tomorrow, we've got a meeting with the jQuery team.</p>
					<p class="ui-li-aside"><strong>6:24</strong>PM</p>
				
			</a></li>
			<li><a href="index.html">
				
				<h3>jQuery Team</h3>
				<p><strong>Boston Conference Planning</strong></p>
				<p>In preparation for the upcoming conference in Boston, we need to start gathering a list of sponsors and speakers.</p>
				<p class="ui-li-aside"><strong>9:18</strong>AM</p>
				
			</a></li>
*/