#!/bin/bash
for i in photos/*.jpg
do
echo "Prcoessing image $i ..."
convert -thumbnail x150 $i thumbnails/$(basename $i)
done
