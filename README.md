launch-image-refactor
=====================

Compare && Rename images' size in 2 directory. Only support png now.
For example:
If target directory has an image named "xx1.png"(1024 x 768) , and the compare dir has an image named "Default@2x.png"(1024 x 768), this tool will help you change xx1.png -> Default@2x.png.

This tool is helping me pack/change ios launch image. Wish it can save you guys some time.

#install

```
npm install -g ios-launchimg
```

#usage

```
ios-launchimg path/to/compare/dir [path/to/target/dir]
```

Target dir is default current path.

Target dir's images will auto renamed if there's an image with the same size.
