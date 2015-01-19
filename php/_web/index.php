<?php
error_reporting(-1);
ini_set('display_errors', 'On');

defined('_JEXEC') or die;

$app = JFactory::getApplication();
$doc = JFactory::getDocument();
$this->language = $doc->language;
// Add current user information
$user = JFactory::getUser();
// Add Bootstrap Framework
JHtml::_('bootstrap.framework');
$doc->addStyleSheet($this->baseurl . '/media/jui/css/bootstrap.min.css');
$doc->addStyleSheet($this->baseurl . '/media/jui/css/bootstrap-responsive.css');
// Add page class suffix
$itemid = JRequest::getVar('Itemid');
$menu = JFactory::getApplication()->getMenu();
$active = $menu->getItem($itemid);
$params = $menu->getParams( $active->id );
$pageclass = $params->get( 'pageclass_sfx' );

?>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>" >

<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->

<head>
	<script type="text/javascript" src="<?php echo $this->baseurl ?>/KURT/js/jquery-1.8.2.js"></script>
	<script type="text/javascript" src="<?php echo $this->baseurl ?>/KURT/js/jquery-ui.js"></script>
    
  
  
  
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <meta name="author" content="Super User" />
  <meta name="generator" content="Joomla! - Open Source Content Management" />
  <title>Info &amp; Help</title>
  <link href="http://www.kurt-climbing.com/Joomla/" rel="canonical" />
  <link href="/Joomla/KURT/files/views/assets/image/favicon.ico" rel="shortcut icon" type="image/vnd.microsoft.icon" />
  <link rel="stylesheet" href="/Joomla/media/jui/css/bootstrap.min.css" type="text/css" />
  <link rel="stylesheet" href="/Joomla/media/jui/css/bootstrap-responsive.css" type="text/css" />
<!--  <script src="/Joomla/media/jui/js/jquery.min.js" type="text/javascript"></script>-->
<!--  <script src="/Joomla/media/jui/js/jquery-noconflict.js" type="text/javascript"></script>-->
<!--  <script src="/Joomla/media/jui/js/jquery-migrate.min.js" type="text/javascript"></script>-->
  <!--<script src="/Joomla/media/system/js/caption.js" type="text/javascript"></script>-->
  <!--<script src="/Joomla/media/jui/js/bootstrap.min.js" type="text/javascript"></script>-->

  
  
	
	<!--<jdoc:include type="head" />-->

	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

	<!-- Stylesheets -->
	<link rel="stylesheet" href="<?php echo $this->baseurl; ?>/templates/<?php echo $this->template;?>/icons/css/font-awesome.css" type="text/css" />
	<link rel="stylesheet" href="<?php echo $this->baseurl; ?>/templates/<?php echo $this->template;?>/css/k2style.css" type="text/css" />
	<link rel="stylesheet" href="<?php echo $this->baseurl; ?>/templates/<?php echo $this->template;?>/css/joomla.css" type="text/css" />
	<link rel="stylesheet" href="<?php echo $this->baseurl; ?>/templates/<?php echo $this->template;?>/css/template.css" type="text/css" />

	<!-- Styles -->
	<link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template;?>/css/styles/<?php echo $this->params->get('templateStyles'); ?>.css" type="text/css" />
	<?php if (isset($_GET['style'])) { $styles = $_GET['style']; }
	if (isset($styles)) { ?>
	<link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template;?>/css/styles/style<?php
		if ($styles == '1') {echo '1';} elseif ($styles == '2') {echo '2';} elseif ($styles == '3') {echo '3';} elseif ($styles == '4') {echo '4';} elseif ($styles == '5') {echo '5';} elseif ($styles == '6') {echo '6';} elseif ($styles == '7') {echo '7';} elseif ($styles == '8') {echo '8';} elseif ($styles == '9') {echo '9';} elseif ($styles == '10') {echo '10';} ?>.css" type="text/css" /> <?php }
		else { echo ""; } ?>

	<!-- Google Font -->
	<link href='css/googleFont_OpenSans.css' rel='stylesheet' type='text/css' />
	<link href='css/googleFont_OpenSans300.css' rel='stylesheet' type='text/css' />
	
	<?php // Parameters
	require($_SERVER['DOCUMENT_ROOT']."/Joomla/templates/favourite/admin/params.php"); ?>

	<?php // Google Analytics Tracking Code
	if($analyticsCode) {echo '<script type="text/javascript">'; echo $analyticsCode; echo '</script>';}?>


	
	
	<script src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/js/backtop/backtop.js"></script>
	<link href='<?php echo $this->baseurl ?>/KURT/css/webClLib.css' rel='stylesheet' type='text/css'>




		
		<script type="text/javascript" src="<?php echo $this->baseurl ?>/KURT/js/webUtils.js"></script>

		<script type="text/javascript" src="/Joomla/KURT/js/clLib.js"></script>
		<script type="text/javascript" src="/Joomla/KURT/js/clLib.auth.js"></script>
        <script type="text/javascript" src="/Joomla/KURT/js/clLib.gradeConfig.js"></script>
        <script type="text/javascript" src="/Joomla/KURT/js/clLib.localStorage.js"></script>
        <script type="text/javascript" src="/Joomla/KURT/js/clLib.localStorage.indexes.js"></script>
        <script type="text/javascript" src="/Joomla/KURT/js/clLib.UI.js"></script>
        <script type="text/javascript" src="/Joomla/KURT/js/clLib.REST.js"></script>
        <script type="text/javascript" src="/Joomla/KURT/js/clLib.PAGES.js"></script>
        <script type="text/javascript" src="/Joomla/KURT/js/clLib.IAP.js"></script>
        <script type="text/javascript" src="/Joomla/KURT/js/clLib.UI.pageConfig.js"></script>
        <script type="text/javascript" src="/Joomla/KURT/js/webClLib.js"></script>



	</head>

<body<?php echo (($pageclass) ? ' class="favbody'.htmlspecialchars($pageclass).'"' : ''); ?>>
  <div id="fav-containerwrap" class="clearfix">

	  <!-- Navbar -->
	  <div class="container-fluid">
			<script>if(!window.foo) { window.foo = 0; } window.foo++; /*alert("FOOOO " + window.foo);*/</script>
			<div class="row-fluid">
				<div id="fav-navbar" class="clearfix">
					<div class="<?php echo htmlspecialchars($mobileNavColor);?>">
						<div class="navbar-inner">
							<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
							</a>
							<div class="nav-collapse collapse">
								<?php if ($this->countModules('nav')) { ?>
									<div id="fav-navbar-collapse" class="span12">
										<jdoc:include type="modules" name="nav" style="icon" />
										<div>XXXXXXXXXXXXX</div>
									</div>
								<?php } ?>
							</div>
						</div>
					</div>
				</div>
			</div>
	  </div>

	  <div id="fav-container">

			<!-- Advert -->
			<?php if ($this->countModules('advert')) { ?>
				<div class="container-fluid" id="fav-advertwrap">
					<div class="row-fluid">
						<div id="fav-advert" class="span12">
							<jdoc:include type="modules" name="advert" style="icon" />
						</div>
					</div>
				</div>
			<?php } ?>

			<!-- Header -->
			<div class="container-fluid" id="fav-headerwrap">
				<div class="row-fluid">

						<div id="fav-header" class="span12">

							<div id="fav-logo" class="span3">
								<?php if (($showDefaultLogo) !=0) : ?>
									<h1>
										<a class="defaultLogo" href="<?php echo $this->baseurl; ?>/">
											<img src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/images/logo/<?php echo htmlspecialchars($defaultLogo);?>" style="border:0;" alt="<?php echo htmlspecialchars($defaultLogoImgAlt);?>" />
										</a>
									</h1>
								<?php endif;?>
								<?php if (($showMediaLogo) !=0) : ?>
									<h1>
										<a class="mediaLogo" href="<?php echo $this->baseurl; ?>/">
											<img src="<?php echo $this->baseurl ?>/<?php echo htmlspecialchars($mediaLogo);?>" style="border:0;" alt="<?php echo htmlspecialchars($mediaLogoImgAlt);?>" />
										</a>
									</h1>
								<?php endif;?>
								<?php if (($showTextLogo) !=0) : ?>
									<h1>
										<a class="textLogo" href="<?php echo $this->baseurl; ?>/"><?php echo htmlspecialchars($textLogo);?></a>
									</h1>
								<?php endif;?>
								<?php if (($showRetinaLogo) !=0) : ?>
									<h1 class="showRetinaLogo">
										<a class="retinaLogo" href="<?php echo $this->baseurl; ?>/">
											<img src="<?php echo $this->baseurl ?>/<?php echo htmlspecialchars($retinaLogo);?>" style="border:0; margin:<?php echo htmlspecialchars($retinaLogoMargin);?>; padding:<?php echo htmlspecialchars($retinaLogoPadding);?>;" width="<?php echo htmlspecialchars($retinaLogoWidth);?>" alt="<?php echo htmlspecialchars($retinaLogoImgAlt);?>" />
										</a>
									</h1>
								<?php endif;?>
								<?php if (($showSlogan) !=0) : ?>
									<div class="slogan"><?php echo htmlspecialchars($slogan);?></div>
								<?php endif;?>
							</div>

								<?php if ($this->countModules('nav')) { ?>
										 <div id="fav-nav" class="span9">
											<div class="navigation">
												<jdoc:include type="modules" name="nav" style="icon" />
											</div>
										</div>
								<?php } ?>

						</div>

				</div>
			</div>

			<!-- Slide -->
			<?php if($this->countModules('slide1') || $this->countModules('slide2')) : ?>

				<div class="container-fluid" id="fav-slidewrap">
					<div class="row-fluid">

							<?php $slide=0;
								if($this->countModules('slide1') && $this->countModules('slide2')) $slide=1;
									?>
							<?php if($this->countModules('slide1') || $this->countModules('slide2')) : ?>

								<div id="fav-slide" class="clearfix">

									<?php if ($this->countModules('slide1')): ?>
											<div id="fav-slide1"
												class="<?php if ( $slide == 1 ):echo ('span8');
												else: echo ('span12');
												endif; ?>">

												<jdoc:include type="modules" name="slide1" style="icon" />

											</div>
									<?php endif; ?>
												<?php if ($this->countModules('slide2')): ?>
										<div id="fav-slide2"
											class="<?php if ( $slide == 1 ):echo ('span4');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="slide2" style="icon" />

										</div>
									<?php endif; ?>

								</div>

							<?php endif; ?>

					</div>
				</div>

			<?php endif; ?>

			<!-- Intro -->
			<?php if($this->countModules('intro1') || $this->countModules('intro2') || $this->countModules('intro3') || $this->countModules('intro4')) : ?>

				<div class="container-fluid" id="fav-introwrap">
					<div class="row-fluid">

							<?php $intro=0;
							for ($i=1; $i<=4 ; $i++) { if ($this->countModules('intro'.$i)) { $intro++; } } ?>

							<?php if($this->countModules('intro1') || $this->countModules('intro2') || $this->countModules('intro3') || $this->countModules('intro4')) : ?>

								<div id="fav-intro" class="clearfix">
									<?php if ($this->countModules('intro1')): ?>
											<div id="fav-intro1"
												class="<?php
												if ( $intro == 2 ):echo ('span6');
												elseif ( $intro == 3 ):echo ('span4');
												elseif ( $intro == 4 ):echo ('span3');
												else: echo ('span12'); endif; ?>">

												<jdoc:include type="modules" name="intro1" style="icon" />

											</div>
									<?php endif; ?>
												<?php if ($this->countModules('intro2')): ?>
										<div id="fav-intro2"
											class="<?php
											if ( $intro == 2 && $this->countModules('intro3') || $intro == 2 && $this->countModules('intro4') ):echo ('span6');
											elseif ( $intro == 2): echo ('span6');
											elseif ( $intro == 3 ):echo ('span4');
											elseif ( $intro == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="intro2" style="icon" />

										</div>
									<?php endif; ?>
												<?php if ($this->countModules('intro3')): ?>
										<div id="fav-intro3"
											class="<?php if ( $intro == 2 && $this->countModules('intro4')):echo ('span6');
											elseif ( $intro == 2):echo ('span6');
											elseif ( $intro == 3 && $this->countModules('intro4')):echo ('span4');
											elseif ($intro == 3): echo ('span4');
											elseif ( $intro == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="intro3" style="icon" />

										</div>
									<?php endif; ?>
									<?php if ($this->countModules('intro4')): ?>
										<div id="fav-intro4"
											class="<?php if ( $intro == 2 ):echo ('span6');
											elseif ( $intro == 3 ):echo ('span4');
											elseif ( $intro == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="intro4" style="icon" />

										</div>
									<?php endif; ?>
								</div>
							<?php endif; ?>

					</div>
				</div>

			<?php endif; ?>

			<!-- Showcase -->
			<?php if($this->countModules('showcase1') || $this->countModules('showcase2') || $this->countModules('showcase3') || $this->countModules('showcase4')) : ?>

				<div class="container-fluid" id="fav-showcasewrap">
					<div class="row-fluid">

							<?php $showcase=0;
							for ($i=1; $i<=4 ; $i++) { if ($this->countModules('showcase'.$i)) { $showcase++; } } ?>

							<?php if($this->countModules('showcase1') || $this->countModules('showcase2') || $this->countModules('showcase3') || $this->countModules('showcase4')) : ?>

								<div id="fav-showcase" class="clearfix">
									<?php if ($this->countModules('showcase1')): ?>
											<div id="fav-showcase1"
												class="<?php if ( $showcase == 2 ):echo ('span6');
												elseif ( $showcase == 3 ):echo ('span4');
												elseif ( $showcase == 4 ):echo ('span3');
												else: echo ('span12'); endif; ?>">

												<jdoc:include type="modules" name="showcase1" style="icon" />

											</div>
									<?php endif; ?>
												<?php if ($this->countModules('showcase2')): ?>
										<div id="fav-showcase2"
											class="<?php if ( $showcase == 2 && $this->countModules('showcase3') || $showcase == 2 && $this->countModules('showcase4') ):echo ('span6');
											elseif ( $showcase == 2): echo ('span6');
											elseif ( $showcase == 3 ):echo ('span4');
											elseif ( $showcase == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="showcase2" style="icon" />

										</div>
									<?php endif; ?>
												<?php if ($this->countModules('showcase3')): ?>
										<div id="fav-showcase3"
											class="<?php if ( $showcase == 2 && $this->countModules('showcase4')):echo ('span6');
											elseif ( $showcase == 2):echo ('span6');
											elseif ( $showcase == 3 && $this->countModules('showcase4')):echo ('span4');
											elseif ($showcase == 3): echo ('span4');
											elseif ( $showcase == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="showcase3" style="icon" />

										</div>
									<?php endif; ?>
									<?php if ($this->countModules('showcase4')): ?>
										<div id="fav-showcase4"
											class="<?php if ( $showcase == 2 ):echo ('span6');
											elseif ( $showcase == 3 ):echo ('span4');
											elseif ( $showcase == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="showcase4" style="icon" />

										</div>
									<?php endif; ?>
								</div>
							<?php endif; ?>

					</div>
				</div>

			<?php endif; ?>

			<!-- Promo -->
			<?php if($this->countModules('promo1') || $this->countModules('promo2') || $this->countModules('promo3')) : ?>

				<div class="container-fluid" id="fav-promowrap">
					<div class="row-fluid">

							<?php $promo=0;
									if ($this->countModules('promo1') && $this->countModules('promo2')) $promo=1;
									if ($this->countModules('promo2') && $this->countModules('promo3')) $promo=2;
									if ($this->countModules('promo1') && $this->countModules('promo3')) $promo=3;
									if ($this->countModules('promo1') && $this->countModules('promo2') && $this->countModules('promo3')) $promo=4;
							?>

							<?php if($this->countModules('promo1') || $this->countModules('promo2') || $this->countModules('promo3')) : ?>

								<div id="fav-promo" class="clearfix">
									<?php if ($this->countModules('promo1')): ?>
											<div id="fav-promo1"
												class="<?php if ( $promo == 1 ):echo ('span6');
												elseif ( $promo == 3 ):echo ('span6');
												elseif ( $promo == 4 ):echo ('span4');
												else: echo ('span12'); endif; ?>">

												<jdoc:include type="modules" name="promo1" style="icon" />

											</div>
									<?php endif; ?>
												<?php if ($this->countModules('promo2')): ?>
										<div id="fav-promo2"
											class="<?php if ( $promo == 1 ):echo ('span6');
											elseif ( $promo == 2 ):echo ('span6');
											elseif ( $promo == 4 ):echo ('span4');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="promo2" style="icon" />

										</div>
									<?php endif; ?>
												<?php if ($this->countModules('promo3')): ?>
										<div id="fav-promo3"
											class="<?php if ( $promo == 2 ):echo ('span6');
											elseif ( $promo == 3 ):echo ('span6');
											elseif ( $promo == 4 ):echo ('span4');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="promo3" style="icon" />

										</div>
									 <?php endif; ?>
								</div>
							<?php endif; ?>

					</div>
				</div>

			<?php endif; ?>

			<!-- Top -->
			<?php if($this->countModules('top1') || $this->countModules('top2') || $this->countModules('top3') || $this->countModules('top4')) : ?>

				<div class="container-fluid" id="fav-topwrap">
					<div class="row-fluid">

							<?php $top=0;
							for ($i=1; $i<=4 ; $i++) { if ($this->countModules('top'.$i)) { $top++; } } ?>

							<?php if($this->countModules('top1') || $this->countModules('top2') || $this->countModules('top3') || $this->countModules('top4')) : ?>

								<div id="fav-top" class="clearfix">
									<?php if ($this->countModules('top1')): ?>
											<div id="fav-top1"
												class="<?php if ( $top == 2 ):echo ('span6');
												elseif ( $top == 3 ):echo ('span4');
												elseif ( $top == 4 ):echo ('span3');
												 else: echo ('span12'); endif; ?>">

												<jdoc:include type="modules" name="top1" style="icon" />

											</div>
									<?php endif; ?>
												<?php if ($this->countModules('top2')): ?>
										<div id="fav-top2"
											class="<?php if ( $top == 2 && $this->countModules('top3') || $top == 2 && $this->countModules('top4') ):echo ('span6');
											elseif ( $top == 2): echo ('span6');
											elseif ( $top == 3 ):echo ('span4');
											elseif ( $top == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="top2" style="icon" />

										</div>
									<?php endif; ?>
												<?php if ($this->countModules('top3')): ?>
										<div id="fav-top3"
											class="<?php if ( $top == 2 && $this->countModules('top4')):echo ('span6');
											elseif ( $top == 2):echo ('span6');
											elseif ( $top == 3 && $this->countModules('top4')):echo ('span4');
											elseif ($top == 3): echo ('span4');
											elseif ( $top == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="top3" style="icon" />

										</div>
									<?php endif; ?>
									<?php if ($this->countModules('top4')): ?>
										<div id="fav-top4"
											class="<?php if ( $top == 2 ):echo ('span6');
											elseif ( $top == 3 ):echo ('span4');
											elseif ( $top == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="top4" style="icon" />

										</div>
									<?php endif; ?>
								</div>
							<?php endif; ?>

					</div>
				</div>

			<?php endif; ?>

			<!-- Maintop -->
			<?php if($this->countModules('maintop1') || $this->countModules('maintop2') || $this->countModules('maintop3')) : ?>

				<div class="container-fluid" id="fav-maintopwrap">
					<div class="row-fluid">

							<?php $maintop=0;
									if ($this->countModules('maintop1') && $this->countModules('maintop2')) $maintop=1;
									if ($this->countModules('maintop2') && $this->countModules('maintop3')) $maintop=2;
									if ($this->countModules('maintop1') && $this->countModules('maintop3')) $maintop=3;
									if ($this->countModules('maintop1') && $this->countModules('maintop2') && $this->countModules('maintop3')) $maintop=4;
							?>

							<?php if($this->countModules('maintop1') || $this->countModules('maintop2') || $this->countModules('maintop3')) : ?>

								<div id="fav-maintop" class="clearfix">
									<?php if ($this->countModules('maintop1')): ?>
											<div id="fav-maintop1"
												class="<?php if ( $maintop == 1 ):echo ('span3');
												elseif ( $maintop == 3 ):echo ('span3');
												elseif ( $maintop == 4 ):echo ('span3');
												else: echo ('span12');
												endif; ?>">

												<jdoc:include type="modules" name="maintop1" style="icon" />

											</div>
									<?php endif; ?>
												<?php if ($this->countModules('maintop2')): ?>
										<div id="fav-maintop2"
											class="<?php if ( $maintop == 1 ):echo ('span9');
											elseif ( $maintop == 2 ):echo ('span9');
											elseif ( $maintop == 4 ):echo ('span6');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="maintop2" style="icon" />

										</div>
									<?php endif; ?>
												<?php if ($this->countModules('maintop3')): ?>
										<div id="fav-maintop3"
											class="<?php if ( $maintop == 2 ):echo ('span3');
											elseif ( $maintop == 3 ):echo ('span9');
											elseif ( $maintop == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="maintop3" style="icon" />

										</div>
									 <?php endif; ?>
								</div>
							<?php endif; ?>

					</div>
				</div>

			<?php endif; ?>

			<!-- Breadcrumbs -->
			<?php if ($this->countModules('breadcrumbs')) { ?>
				<div class="container-fluid">
					<div class="row-fluid">
						<div id="fav-breadcrumbs" class="span12">
							<jdoc:include type="modules" name="breadcrumbs" style="icon" />
						</div>
					</div>
				</div>
			<?php } ?>

			<!-- Main -->
			<div class="container-fluid" id="fav-mainwrap">
				<div class="row-fluid">

						<div id="fav-main" class="clearfix">

							<?php if ($this->countModules('sidebar1') && $this->countModules('sidebar2')): ?>
								<div id="fav-sidebar1" class="span3">
										<jdoc:include type="modules" name="sidebar1" style="icon" />
									</div>
								<div id="fav-maincontent" class="span6">
									<jdoc:include type="message" />
									<jdoc:include type="component" />
								</div>
								<div id="fav-sidebar2" class="span3">
										<jdoc:include type="modules" name="sidebar2" style="icon" />
									</div>
							<?php elseif ( $this->countModules('sidebar1')) : ?>
								<div id="fav-sidebar1" class="span3">
										<jdoc:include type="modules" name="sidebar1" style="icon" />
									</div>
								<div id="fav-maincontent" class="span9">
									<jdoc:include type="message" />
									<jdoc:include type="component" />
								</div>
							<?php elseif ( $this->countModules('sidebar2')): ?>
								<div id="fav-maincontent" class="span9">
									<jdoc:include type="message" />
									<jdoc:include type="component" />
								</div>
								<div id="fav-sidebar2" class="span3">
										<jdoc:include type="modules" name="sidebar2" style="icon" />
									</div>
							<?php else : ?>
								<div id="fav-maincontent" class="span12">
								<jdoc:include type="message" />
									<jdoc:include type="component" />
								</div>
							<?php endif; ?>

						</div>

				</div>
			</div>

			<!-- Start of first page -->
			
			<!-- Mainbottom -->
			<?php if($this->countModules('mainbottom1') || $this->countModules('mainbottom2') || $this->countModules('mainbottom3')) : ?>

				<div class="container-fluid" id="fav-mainbottomwrap">
					<div class="row-fluid">

							<?php $mainbottom=0;
									if ($this->countModules('mainbottom1') && $this->countModules('mainbottom2')) $mainbottom=1;
									if ($this->countModules('mainbottom2') && $this->countModules('mainbottom3')) $mainbottom=2;
									if ($this->countModules('mainbottom1') && $this->countModules('mainbottom3')) $mainbottom=3;
									if ($this->countModules('mainbottom1') && $this->countModules('mainbottom2') && $this->countModules('mainbottom3')) $mainbottom=4;
							?>

							<?php if($this->countModules('mainbottom1') || $this->countModules('mainbottom2') || $this->countModules('mainbottom3')) : ?>

								<div id="fav-mainbottom" class="clearfix">
									<?php if ($this->countModules('mainbottom1')): ?>
											<div id="fav-mainbottom1"
												class=" <?php if ( $mainbottom == 1 ):echo ('span3');
												elseif ( $mainbottom == 3 ):echo ('span3');
												elseif ( $mainbottom == 4 ):echo ('span3');
												else: echo ('span12'); endif; ?>">

												<jdoc:include type="modules" name="mainbottom1" style="icon" />

											</div>
									<?php endif; ?>
												<?php if ($this->countModules('mainbottom2')): ?>
										<div id="fav-mainbottom2"
											class="<?php if ( $mainbottom == 1 ):echo ('span9');
											elseif ( $mainbottom == 2 ):echo ('span9');
											elseif ( $mainbottom == 4 ):echo ('span6');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="mainbottom2" style="icon" />

										</div>
									<?php endif; ?>
												<?php if ($this->countModules('mainbottom3')): ?>
										<div id="fav-mainbottom3"
											class="<?php if ( $mainbottom == 2 ):echo ('span3');
											elseif ( $mainbottom == 3 ):echo ('span9');
											elseif ( $mainbottom == 4 ):echo ('span3');
											else: echo ('span12');
											endif; ?>">

											<jdoc:include type="modules" name="mainbottom3" style="icon" />

										</div>
									 <?php endif; ?>
								</div>
							<?php endif; ?>

					</div>
				</div>

			<?php endif; ?>

			<!-- Bottom -->
			<?php if($this->countModules('bottom1') || $this->countModules('bottom2') || $this->countModules('bottom3') || $this->countModules('bottom4')) : ?>

				<div class="container-fluid" id="fav-bottomwrap">
					<div class="row-fluid">

							<?php $bottom=0;
							for ($i=1; $i<=4 ; $i++) { if ($this->countModules('bottom'.$i)) { $bottom++; } } ?>

							<?php if($this->countModules('bottom1') || $this->countModules('bottom2') || $this->countModules('bottom3') || $this->countModules('bottom4')) : ?>

								<div id="fav-bottom" class="clearfix">
									<?php if ($this->countModules('bottom1')): ?>
											<div id="fav-bottom1"
												class="<?php if ( $bottom == 2 ):echo ('span6');
												elseif ( $bottom == 3 ):echo ('span4');
												elseif ( $bottom == 4 ):echo ('span3');
												else: echo ('span12');
												endif; ?>">

												<jdoc:include type="modules" name="bottom1" style="icon" />

											</div>
									<?php endif; ?>
												<?php if ($this->countModules('bottom2')): ?>
										<div id="fav-bottom2"
											class="<?php if ( $bottom == 2 && $this->countModules('bottom3') || $bottom == 2 && $this->countModules('bottom4') ):echo ('span6');
											elseif ( $bottom == 2): echo ('span6');
											elseif ( $bottom == 3 ):echo ('span4');
											elseif ( $bottom == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="bottom2" style="icon" />

										</div>
									<?php endif; ?>
												<?php if ($this->countModules('bottom3')): ?>
										<div id="fav-bottom3"
											class="<?php if ( $bottom == 2 && $this->countModules('bottom4')):echo ('span6');
											elseif ( $bottom == 2):echo ('span6');
											elseif ( $bottom == 3 && $this->countModules('bottom4')):echo ('span4');
											elseif ($bottom == 3): echo ('span4');
											elseif ( $bottom == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="bottom3" style="icon" />

										</div>
									<?php endif; ?>
									<?php if ($this->countModules('bottom4')): ?>
										<div id="fav-bottom4"
											class="<?php if ( $bottom == 2 ):echo ('span6');
											elseif ( $bottom == 3 ):echo ('span4');
											elseif ( $bottom == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="bottom4" style="icon" />

										</div>
									<?php endif; ?>
								</div>
							<?php endif; ?>

					</div>
				</div>

			<?php endif; ?>

			<!-- User -->
			<?php if($this->countModules('user1') || $this->countModules('user2') || $this->countModules('user3')) : ?>

				<div class="container-fluid" id="fav-userwrap">
					<div class="row-fluid">

							<?php $user=0;
									if ($this->countModules('user1') && $this->countModules('user2')) $user=1;
									if ($this->countModules('user2') && $this->countModules('user3')) $user=2;
									if ($this->countModules('user1') && $this->countModules('user3')) $user=3;
									if ($this->countModules('user1') && $this->countModules('user2') && $this->countModules('user3')) $user=4;
							?>

							<?php if($this->countModules('user1') || $this->countModules('user2') || $this->countModules('user3')) : ?>

								<div id="fav-user" class="clearfix">
									<?php if ($this->countModules('user1')): ?>
											<div id="fav-user1"
												class="<?php if ( $user == 1 ):echo ('span6');
												 elseif ( $user == 3 ):echo ('span6');
												 elseif ( $user == 4 ):echo ('span4');
												 else: echo ('span12'); endif; ?>">

												<jdoc:include type="modules" name="user1" style="icon" />

											</div>
									<?php endif; ?>
												<?php if ($this->countModules('user2')): ?>
										<div id="fav-user2"
											class="<?php if ( $user == 1 ):echo ('span6');
											elseif ( $user == 2 ):echo ('span6');
											elseif ( $user == 4 ):echo ('span4');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="user2" style="icon" />

										</div>
									<?php endif; ?>
												<?php if ($this->countModules('user3')): ?>
										<div id="fav-user3"
											class="<?php if ( $user == 2 ):echo ('span6');
											elseif ( $user == 3 ):echo ('span6');
											elseif ( $user == 4 ):echo ('span4');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="user3" style="icon" />
										</div>
									 <?php endif; ?>
								</div>
							<?php endif; ?>

					</div>
				</div>

			<?php endif; ?>

			<!-- Backtotop -->
			<div class="container-fluid">
				<div class="row-fluid">
					<?php if (($showBacktotop) !=0) : ?>
						<div id="fav-backtotop" class="span12">
							<a href="" class="backtop" title="BACK TO TOP"><i class="fa fa-angle-up"></i>
								<?php if (isset($backtotopText)) { echo htmlspecialchars($backtotopText); } else { echo ''; } ?>
							</a>
						</div>
					<?php endif; ?>
				</div>
			</div>

			<!-- Footer -->
			<?php if($this->countModules('footer1') || $this->countModules('footer2') || $this->countModules('footer3') || $this->countModules('footer4')) : ?>

				<div class="container-fluid" id="fav-footerwrap">
					<div class="row-fluid">

							<?php $footer=0;
							for ($i=1; $i<=4 ; $i++) { if ($this->countModules('footer'.$i)) { $footer++; } } ?>

							<?php if($this->countModules('footer1') || $this->countModules('footer2') || $this->countModules('footer3') || $this->countModules('footer4')) : ?>

								<div id="fav-footer" class="clearfix">
									<?php if ($this->countModules('footer1')): ?>
											<div id="fav-footer1"
												class="<?php if ( $footer == 2 ):echo ('span6');
												elseif ( $footer == 3 ):echo ('span4');
												elseif ( $footer == 4 ):echo ('span3');
												else: echo ('span12'); endif; ?>">

												<jdoc:include type="modules" name="footer1" style="icon" />

											</div>
									<?php endif; ?>
												<?php if ($this->countModules('footer2')): ?>
										<div id="fav-footer2"
											class="<?php if ( $footer == 2 && $this->countModules('footer3') || $footer == 2 && $this->countModules('footer4') ):echo ('span6');
											elseif ( $footer == 2): echo ('span6');
											elseif ( $footer == 3 ):echo ('span4');
											elseif ( $footer == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="footer2" style="icon" />

										</div>
									<?php endif; ?>
												<?php if ($this->countModules('footer3')): ?>
										<div id="fav-footer3"
											class="<?php if ( $footer == 2 && $this->countModules('footer4')):echo ('span6');
											elseif ( $footer == 2):echo ('span6');
											elseif ( $footer == 3 && $this->countModules('footer4')):echo ('span4');
											elseif ($footer == 3): echo ('span4');
											elseif ( $footer == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="footer3" style="icon" />
										</div>
									<?php endif; ?>
									<?php if ($this->countModules('footer4')): ?>
										<div id="fav-footer4"
											class="<?php if ( $footer == 2 ):echo ('span6');
											elseif ( $footer == 3 ):echo ('span4');
											elseif ( $footer == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="footer4" style="icon" />

										</div>
									<?php endif; ?>
								</div>
							<?php endif; ?>

					</div>
				</div>

			<?php endif; ?>

			<!-- Backtotop mobile -->
			<div class="container-fluid">
				<div class="row-fluid">
					<div id="fav-backtotop-mobile" class="span12">
						<a href="" class="backtop" title="BACK TO TOP"><i class="fa fa-angle-up"></i>
							<?php if (isset($backtotopText)) { echo htmlspecialchars($backtotopText); } else { echo ''; } ?>
						</a>
					</div>
				</div>
			</div>

			<!-- Copyright -->
			<?php if($this->countModules('copyright1') || $this->countModules('copyright2') || $showCopyright) : ?>

				<div class="container-fluid" id="fav-copyrightwrap">
					<div class="row-fluid">

							<?php $copyright=0;
								if ($this->countModules('copyright1') && $this->countModules('copyright2')) $copyright=1;
								if ($this->countModules('copyright2') && $showCopyright) $copyright=2;
								if ($this->countModules('copyright1') && $showCopyright) $copyright=3;
								if ($this->countModules('copyright1') && $this->countModules('copyright2') && $showCopyright) $copyright=4;
							?>

							<?php if($this->countModules('copyright1') || $this->countModules('copyright2') || $showCopyright) : ?>

								<div id="fav-copyright" class="clearfix">

									<?php if (($showCopyright) !=0) : ?>
										<div id="fav-showcopyright"
											class="<?php
											if ( $copyright == 2 ):echo ('span3');
											elseif ( $copyright == 3 ):echo ('span3');
											elseif ( $copyright == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">
												<p>&#0169; <?php echo date('Y'); ?>

													<a href="http://<?php echo htmlspecialchars($copyrightTextLink);?>" target="_blank">
														<?php echo htmlspecialchars($copyrightText);?>
													</a>

												</p>

										</div>
									<?php endif; ?>

									<?php if ($this->countModules('copyright1')): ?>
											<div id="fav-copyright1"
												class="<?php
												if ( $copyright == 1 ):echo ('span3');
												elseif ( $copyright == 3 ):echo ('span9');
												elseif ( $copyright == 4 ):echo ('span6');
												else: echo ('span12'); endif; ?>">

												<jdoc:include type="modules" name="copyright1" style="icon" />

											</div>
									<?php endif; ?>

												<?php if ($this->countModules('copyright2')): ?>
										<div id="fav-copyright2"
											class="<?php
											if ( $copyright == 1 ):echo ('span9');
											elseif ( $copyright == 2 ):echo ('span9');
											elseif ( $copyright == 4 ):echo ('span3');
											else: echo ('span12'); endif; ?>">

											<jdoc:include type="modules" name="copyright2" style="icon" />

										</div>
									<?php endif; ?>

								</div>
							<?php endif; ?>

					</div>
				</div>

			<?php endif; ?>

			<!-- Debug -->
			<?php if ($this->countModules('debug')) { ?>
				<div class="container-fluid" id="fav-debugwrap">
					<div class="row-fluid">
						<div id="fav-debug" class="span12 ">
							<jdoc:include type="modules" name="debug" style="icon" />
						</div>
					</div>
				</div>
			<?php } ?>

		</div><!-- end of fav-container -->

  </div><!-- end of fav-containerwrap -->

<!--[if lte IE 7]><script src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/js/ie6/warning.js"></script><script>window.onload=function(){e("<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/js/ie6/")}</script><![endif]-->
</body>


</html>
