#/bin/perl

my $filename = $ARGV[0];

open(IN, $filename)  or die "cant open file >$filename<\n";
my $out = "[";
my $first = 1;
while(<IN>) {
	my $line = $_;
	if(!$first) {
		$out .= ",";
	} 
	else {
		$first = 0;
	}
	$out .= $line;
}
$out .= "]";
close IN or die "cant close >$filename<\n";
open (OUT,">$filename") or die "cant write file >$filename<\n";
print OUT $out;
close OUT or die "cant close out file .";