randomSign = () ->
  if Math.random() > .5 
    1
  else
    -1

maxByIndex = (arrayOfArrays, index) ->
  """Get the maximum Array in an Array of Arrays according to 
  ordering by one of the indexes
  e.g. maxByElem [["hello", 1], ["goodbye", 2]], 1 -> ["goodbye", 2]"""
  unless arrayOfArrays.length then return null
  maxIndex = arrayOfArrays[0][index]
  maxArray = arrayOfArrays[0]
  for arr in arrayOfArrays
    if arr[index] > maxIndex
      maxIndex = arr[index]
      maxArray = arr
  unless maxIndex? then throw new Error("maxByIndex: Index out of bounds for entire array")
  maxArray

minByIndex = (arrayOfArrays, index) ->
  """Get the minimum Array in an Array of Arrays according to 
  ordering by one of the indexes
  e.g. minByElem [["hello", 1], ["goodbye", 2]], 1 -> ["goodbye", 2]"""
  unless arrayOfArrays.length then return null
  minIndex = arrayOfArrays[0][index]
  minArray = arrayOfArrays[0]
  for arr in arrayOfArrays
    if arr[index] < minIndex
      minIndex = arr[index]
      minArray = arr
  unless minIndex? then throw new Error("minByIndex: Index out of bounds for entire array")
  minArray
