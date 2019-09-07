echo "-----> Minify JavaScript"
for filename in $@
do
  echo "Minify $filename"
  babel --plugins transform-react-jsx --presets=babili $filename -o $filename
done
