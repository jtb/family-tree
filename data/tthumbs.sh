#!/bin/bash
for i in tombstones/*.jpg
do
echo "Prcoessing image $i ..."
convert -thumbnail x150 $i tombstonethumbs/$(basename $i)
done
