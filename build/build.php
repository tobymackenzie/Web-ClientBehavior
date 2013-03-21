<?php
//--config
$buildExecutable = 'yuicompressor';
$targetPrefix = ' > ';
$sourcePath = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'src';
$buildFiles = Array(
	'core/dependencyWrapStart.js'
	,'core/base.js'
	,'core/dependencyWrapEnd.js'
);
$tmpPath = DIRECTORY_SEPARATOR . 'tmp';
$tmpFileName = 'tmlib.' . date('YmdBu') . '.js';
$tmpFilePath = $tmpPath . DIRECTORY_SEPARATOR . $tmpFileName;

//--prepare arguments by removing first (name of executable), removing and grabbing last (output target)
array_shift($argv);
$outputTarget = array_pop($argv);
if($outputTarget[0] == '-'){
	$argv[] = $outputTarget;
	$outputTarget = null;
}
if(!$outputTarget){
	$outputTarget = __DIR__ . DIRECTORY_SEPARATOR . 'base.js';
}

//--prepare build files array for command by converting into string
$buildFilesForCommand = '';
foreach($buildFiles as $buildFile){
	if($buildFile[0] == '/'){
		$buildFilesForCommand .= "{$buildFile} ";
	}else{
		$buildFilesForCommand .= $sourcePath . DIRECTORY_SEPARATOR . $buildFile . ' ';
	}
}

//--cat temp files into a combined temp file
passthru("cat {$buildFilesForCommand} > {$tmpFilePath}");


$arguments = implode(' ', array_values($argv));
$command = "{$buildExecutable} {$arguments} {$tmpFilePath} {$targetPrefix} {$outputTarget}";
//$command = "{$buildExecutable} {$arguments} {$buildFilesForCommand}";
//$command = "cat {$buildFilesForCommand} {$targetPrefix} {$outputTarget}";
echo "{$command}\n";
passthru($command);

//--remove temporary file
unlink($tmpFilePath);
