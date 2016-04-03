#!/bin/bash
for i in tombstones/processed/*.jpg
do
echo "Processing image $i ..."
convert -thumbnail x150 $i tombstonethumbs/$(basename $i)
done
