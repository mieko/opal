/* Generated by Opal 0.5.2 */
(function($opal) {
  var self = $opal.top, $scope = $opal, nil = $opal.nil, $breaker = $opal.breaker, $slice = $opal.slice, $klass = $opal.klass, $gvars = $opal.gvars;
  $opal.add_stubs(['$[]', '$name_for', '$include', '$attr_reader', '$==', '$for', '$to_n', '$enum_for']);
  return (function($base, $super) {
    function Buffer(){};
    var self = Buffer = $klass($base, $super, 'Buffer', Buffer);

    var def = Buffer._proto, $scope = Buffer._scope;
    return (function($base, $super) {
      function Array(){};
      var self = Array = $klass($base, $super, 'Array', Array);

      var def = Array._proto, $scope = Array._scope, TMP_1, TMP_2;
      def['native'] = nil;
      $opal.defs(self, '$for', function(bits, type) {
        var self = this;
        return $gvars["$"]['$[]']("" + ($scope.Buffer.$name_for(bits, type)) + "Array");
      });

      self.$include($scope.Enumerable);

      self.$attr_reader("buffer", "type");

      def.$initialize = TMP_1 = function(buffer, bits, type) {
        var self = this, $iter = TMP_1._p, $yield = $iter || nil;
        if (bits == null) {
          bits = nil
        }
        if (type == null) {
          type = nil
        }
        TMP_1._p = null;
        if ($scope.Native['$=='](buffer)) {
          $opal.find_super_dispatcher(self, 'initialize', TMP_1, null).apply(self, [buffer])
          } else {
          
        var klass = $scope.Array.$for(bits, type);

        $opal.find_super_dispatcher(self, 'initialize', TMP_1, null).apply(self, [new klass(buffer.$to_n())])
      ;
        };
        self.buffer = buffer;
        return self.type = type;
      };

      def.$bits = function() {
        var self = this;
        return self['native'].BYTES_PER_ELEMENT * 8;
      };

      def['$[]'] = function(index, offset) {
        var self = this;
        if (offset == null) {
          offset = nil
        }
        if (offset !== false && offset !== nil) {
          return self['native'].subarray(index, offset);
          } else {
          return self['native'][index];
        };
      };

      def['$[]='] = function(index, value) {
        var self = this;
        return self['native'][index] = value;
      };

      def.$bytesize = function() {
        var self = this;
        return self['native'].byteLength;
      };

      def.$each = TMP_2 = function() {
        var $a, self = this, $iter = TMP_2._p, $yield = $iter || nil;
        TMP_2._p = null;
        if ($yield === nil) {
          return self.$enum_for("each")};
        
      for (var i = 0, length = self['native'].length; i < length; i++) {
        ((($a = $opal.$yield1($yield, self['native'][i])) === $breaker) ? $breaker.$v : $a)
      }
    ;
        return self;
      };

      def.$length = function() {
        var self = this;
        return self['native'].length;
      };

      def['$merge!'] = function(other, offset) {
        var self = this;
        return self['native'].set(other.$to_n(), offset);
      };

      return $opal.defn(self, '$size', def.$length);
    })(self, $scope.Native)
  })(self, $scope.Native)
})(Opal);

//@ sourceMappingURL=/__opal_source_maps__/buffer/array.js.map
;
/* Generated by Opal 0.5.2 */
(function($opal) {
  var self = $opal.top, $scope = $opal, nil = $opal.nil, $breaker = $opal.breaker, $slice = $opal.slice, $klass = $opal.klass, $gvars = $opal.gvars;
  $opal.add_stubs(['$include', '$nil?', '$[]', '$attr_reader', '$native?', '$to_n', '$name_for']);
  return (function($base, $super) {
    function Buffer(){};
    var self = Buffer = $klass($base, $super, 'Buffer', Buffer);

    var def = Buffer._proto, $scope = Buffer._scope;
    return (function($base, $super) {
      function View(){};
      var self = View = $klass($base, $super, 'View', View);

      var def = View._proto, $scope = View._scope, TMP_1;
      def['native'] = nil;
      self.$include(($scope.Native)._scope.Base);

      $opal.defs(self, '$supported?', function() {
        var $a, self = this;
        return ($a = $gvars["$"]['$[]']("DataView")['$nil?'](), ($a === nil || $a === false));
      });

      self.$attr_reader("buffer", "offset");

      def.$initialize = TMP_1 = function(buffer, offset, length) {
        var $a, $b, self = this, $iter = TMP_1._p, $yield = $iter || nil;
        if (offset == null) {
          offset = nil
        }
        if (length == null) {
          length = nil
        }
        TMP_1._p = null;
        if (($a = self['$native?'](buffer)) !== false && $a !== nil) {
          $opal.find_super_dispatcher(self, 'initialize', TMP_1, null).apply(self, [buffer])
        } else if (($a = (($b = offset !== false && offset !== nil) ? length : $b)) !== false && $a !== nil) {
          $opal.find_super_dispatcher(self, 'initialize', TMP_1, null).apply(self, [new DataView(buffer.$to_n(), offset.$to_n(), length.$to_n())])
        } else if (offset !== false && offset !== nil) {
          $opal.find_super_dispatcher(self, 'initialize', TMP_1, null).apply(self, [new DataView(buffer.$to_n(), offset.$to_n())])
          } else {
          $opal.find_super_dispatcher(self, 'initialize', TMP_1, null).apply(self, [new DataView(buffer.$to_n())])
        };
        self.buffer = buffer;
        return self.offset = offset;
      };

      def.$length = function() {
        var self = this;
        return self['native'].byteLength;
      };

      $opal.defn(self, '$size', def.$length);

      def.$get = function(offset, bits, type, little) {
        var self = this;
        if (bits == null) {
          bits = 8
        }
        if (type == null) {
          type = "unsigned"
        }
        if (little == null) {
          little = false
        }
        return self['native']["get" + $scope.Buffer.$name_for(bits, type)](offset, little);
      };

      $opal.defn(self, '$[]', def.$get);

      def.$set = function(offset, value, bits, type, little) {
        var self = this;
        if (bits == null) {
          bits = 8
        }
        if (type == null) {
          type = "unsigned"
        }
        if (little == null) {
          little = false
        }
        return self['native']["set" + $scope.Buffer.$name_for(bits, type)](offset, value, little);
      };

      $opal.defn(self, '$[]=', def.$set);

      def.$get_int8 = function(offset, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].getInt8(offset, little);
      };

      def.$set_int8 = function(offset, value, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].setInt8(offset, value, little);
      };

      def.$get_uint8 = function(offset, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].getUint8(offset, little);
      };

      def.$set_uint8 = function(offset, value, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].setUint8(offset, value, little);
      };

      def.$get_int16 = function(offset, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].getInt16(offset, little);
      };

      def.$set_int16 = function(offset, value, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].setInt16(offset, value, little);
      };

      def.$get_uint16 = function(offset, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].getUint16(offset, little);
      };

      def.$set_uint16 = function(offset, value, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].setUint16(offset, value, little);
      };

      def.$get_int32 = function(offset, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].getInt32(offset, little);
      };

      def.$set_int32 = function(offset, value, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].setInt32(offset, value, little);
      };

      def.$get_uint32 = function(offset, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].getUint32(offset, little);
      };

      def.$set_uint32 = function(offset, value, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].setUint32(offset, value, little);
      };

      def.$get_float32 = function(offset, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].getFloat32(offset, little);
      };

      def.$set_float32 = function(offset, value, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].setFloat32(offset, value, little);
      };

      def.$get_float64 = function(offset, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].getFloat64(offset, little);
      };

      return (def.$set_float64 = function(offset, value, little) {
        var self = this;
        if (little == null) {
          little = false
        }
        return self['native'].setFloat64(offset, value, little);
      }, nil);
    })(self, null)
  })(self, null)
})(Opal);

//@ sourceMappingURL=/__opal_source_maps__/buffer/view.js.map
;
/* Generated by Opal 0.5.2 */
(function($opal) {
  var self = $opal.top, $scope = $opal, nil = $opal.nil, $breaker = $opal.breaker, $slice = $opal.slice, $klass = $opal.klass, $gvars = $opal.gvars;
  $opal.add_stubs(['$include', '$nil?', '$[]', '$===', '$native?', '$new']);
  ;
  ;
  return (function($base, $super) {
    function Buffer(){};
    var self = Buffer = $klass($base, $super, 'Buffer', Buffer);

    var def = Buffer._proto, $scope = Buffer._scope, TMP_1;
    def['native'] = nil;
    self.$include(($scope.Native)._scope.Base);

    $opal.defs(self, '$supported?', function() {
      var $a, self = this;
      return ($a = $gvars["$"]['$[]']("ArrayBuffer")['$nil?'](), ($a === nil || $a === false));
    });

    $opal.defs(self, '$name_for', function(bits, type) {
      var self = this, $case = nil;
      return "" + ((function() {$case = type;if ("unsigned"['$===']($case)) {return "Uint"}else if ("signed"['$===']($case)) {return "Int"}else if ("float"['$===']($case)) {return "Float"}else { return nil }})()) + (bits);
    });

    def.$initialize = TMP_1 = function(size, bits) {
      var $a, self = this, $iter = TMP_1._p, $yield = $iter || nil;
      if (bits == null) {
        bits = 8
      }
      TMP_1._p = null;
      if (($a = self['$native?'](size)) !== false && $a !== nil) {
        return $opal.find_super_dispatcher(self, 'initialize', TMP_1, null).apply(self, [size])
        } else {
        return $opal.find_super_dispatcher(self, 'initialize', TMP_1, null).apply(self, [new ArrayBuffer(size * (bits / 8))])
      };
    };

    def.$length = function() {
      var self = this;
      return self['native'].byteLength;
    };

    $opal.defn(self, '$size', def.$length);

    def.$to_a = function(bits, type) {
      var self = this;
      if (bits == null) {
        bits = 8
      }
      if (type == null) {
        type = "unsigned"
      }
      return $scope.Array.$new(self, bits, type);
    };

    return (def.$view = function(offset, length) {
      var self = this;
      if (offset == null) {
        offset = nil
      }
      if (length == null) {
        length = nil
      }
      return $scope.View.$new(self, offset, length);
    }, nil);
  })(self, null);
})(Opal);

//@ sourceMappingURL=/__opal_source_maps__/buffer.js.map
;
