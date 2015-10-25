# Vector class modified from work by Daniel Shiffman
# http://processingjs.org/learning/topic/flocking/
Math.PI2 = 2 * Math.PI

class Vector2D
    # Class methods for nondestructively operating
    for name in ['add', 'subtract', 'multiply', 'divide']
      do (name) ->
        Vector2D[name] = (a,b) ->
          a.copy()[name](b)

    Vector2D.randomUnitVector = () ->
      v = new Vector2D(Math.random()-.5, Math.random()-.5)
      v.normalize()

    Vector2D.randomVector = (xMax, yMax) ->
      new Vector2D(Math.random() * xMax, Math.random() * yMax)

    Vector2D.randomBoundedVector = (xMin, xMax, yMin, yMax) -> 
      v = Vector2D.randomVector(xMax-xMin, yMax-yMin)
      v.add(new Vector2D(xMin, yMin))

    Vector2D.randomHeading = () -> 
      Math.random() * Math.PI2

    Vector2D.negateHeading = (h) -> 
      (h + Math.PI) % Math.PI2

    Vector2D.headingVector = (h) -> 
      new Vector2D(Math.cos(h), Math.sin(h))

    constructor: (x=0,y=0) ->
      [@x,@y] = [x,y]

    copy: ->
      new Vector2D(@x,@y)

    magnitude: ->
      Math.sqrt(@x*@x + @y*@y)
    
    normalize: ->
      m = this.magnitude()
      this.divide(m) if m > 0
      return this
    
    limit: (max) ->
      if this.magnitude() > max
        this.normalize()
        return this.multiply(max)
      else
        return this
  
    heading: ->
      (Math.atan2(@y,@x) + Math.PI2) % Math.PI2

    eucl_distance: (other) ->
      dx = @x-other.x
      dy = @y-other.y
      Math.sqrt(dx*dx + dy*dy)

    distSq: (other) -> 
      dx = @x - other.x
      dy = @y - other.y
      dx*dx + dy*dy

    distance: (other, dimensions = false) ->
      dx = Math.abs(@x-other.x)
      dy = Math.abs(@y-other.y)
      # Wrap
      if dimensions
        dx = if dx < dimensions.width/2 then dx else dimensions.width - dx
        dy = if dy < dimensions.height/2 then dy else dimensions.height - dy

      Math.sqrt(dx*dx + dy*dy)

    subtract: (other) ->
      @x -= other.x
      @y -= other.y
      this
 
    add: (other) ->
      @x += other.x
      @y += other.y
      this

    divide: (n) ->
      [@x,@y] = [@x/n,@y/n]
      this

    multiply: (n) ->
      [@x,@y] = [@x*n,@y*n]
      this
    
    dot: (other) ->
      @x*other.x + @y*other.y
    
    # Not the strict projection, the other isn't converted to a unit vector first.
    projectOnto: (other) ->
      other.copy().multiply(this.dot(other))
    
    wrapToBound: (xBound, yBound) -> 
      @x = (@x+xBound) % xBound
      @y = (@y+yBound) % yBound

    constrainToBound: (xBound, yBound) -> 
      if @x < 0 then @x = 0
      if @x > xBound then @x = xBound

      if @y < 0 then @y = 0
      if @y > yBound then @y = yBound

    # Called on a vector acting as a position vector to return the wrapped representation closest
    # to another location
    wrapRelativeTo: (location, dimensions) ->
      v = this.copy()
      for a,key of {x:"width", y:"height"}
        d = this[a]-location[a]
        map_d = dimensions[key]
        # If the distance is greater than half the map wrap it.
        if Math.abs(d) > map_d/2
          # If the distance is positive, then the this vector is in front of the location, and it 
          # would be closer to the location if it were wrapped to the negative behind the axis
          if d > 0
            # Take the distance to the axis and put the point behind the opposite side of the map by
            # that much
            v[a] = (map_d - this[a]) * -1
          else
          # If the distance is negative, then this this vector is behind the location, and it
          # would be closer if it were wrapped in front of the location past the axis in the positive
          # direction. Take the distance back to the axis, and put the point past the edge by that much
            v[a] = (this[a] + map_d)
      v

    invalid: () ->
      return (@x == Infinity) || isNaN(@x) || @y == Infinity || isNaN(@y)
