# `init_genrand`, `genrand_res53` and `genrand_int32` are based on the following
# works:
#
# ----
#
# A C-program for MT19937, with initialization improved 2002/1/26.
# Coded by Takuji Nishimura and Makoto Matsumoto.
#
# Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
#
#   1. Redistributions of source code must retain the above copyright
#      notice, this list of conditions and the following disclaimer.
#
#   2. Redistributions in binary form must reproduce the above copyright
#      notice, this list of conditions and the following disclaimer in the
#      documentation and/or other materials provided with the distribution.
#
#   3. The names of its contributors may not be used to endorse or promote
#      products derived from this software without specific prior written
#      permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
# A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
# CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
# EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
# PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
# PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
# LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
# NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
# ----
#
# Sean McCullough's Javascript port, published here:
#   <https://gist.github.com/banksean/300494>

class Random
  attr_reader :seed

  def initialize(seed = Random.new_seed)
    @seed = seed
    @n    = 624
    @m    = 397
    @mt   = `new Array(this.n)`
    @mti  = @n + 1

    init_genrand!
  end

  def rand(max = nil)
    case max
      when nil;   genrand_res53
      when Range; rand_range(max)
      when Float; rand_float(max)
      else;       rand_int(Opal.coerce_to!(max, Integer, :to_int))
    end
  end

  def bytes(size)
    fail NotImplementedError
  end

  def ==(other)
    @state == other.send(:state)
  end

  private
  def state
    [@seed, @mt, @mti]
  end

  def srand(seed)
    @seed = seed
    init_genrand!
  end

  def rand_range(max)
    fail NotImplementedError
  end

  def rand_int
    fail NotImplementedError
  end

  def rand_float
    fail NotImplementedError
  end

  def init_genrand!
    %x{
      var s = this.seed;
      this.mt[0] = s >>> 0;
      for (this.mti = 1; this.mti < this.n; this.mti++) {
        var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
        this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
                             (s & 0x0000ffff) * 1812433253) + this.mti;
        this.mt[this.mti] >>>= 0;
      }
    }
  end

  def genrand_int32
    %x{
      var MATRIX_A   = 0x9908b0df,
          UPPER_MASK = 0x80000000,
          LOWER_MASK = 0x7fffffff;

      var y;
      var mag01 = new Array(0x0, MATRIX_A);
      /* mag01[x] = x * MATRIX_A  for x=0,1 */

      if (this.mti >= this.n) { /* generate N words at one time */
        var kk;

        for (kk = 0; kk < this.n - this.m; kk++) {
          y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
          this.mt[kk] = this.mt[kk + this.m] ^ (y >>> 1) ^ mag01[y & 0x1];
        }
        for (; kk < this.n - 1; kk++) {
          y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk+1] & LOWER_MASK);
          this.mt[kk] = this.mt[kk + (this.m - this.n)] ^ (y >>> 1) ^ mag01[y & 0x1];
        }
        y = (this.mt[this.n - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
        this.mt[this.n - 1] = this.mt[this.m - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

        this.mti = 0;
      }

      y = this.mt[this.mti++];

      /* Tempering */
      y ^= (y >>> 11);
      y ^= (y << 7) & 0x9d2c5680;
      y ^= (y << 15) & 0xefc60000;
      y ^= (y >>> 18);

      return y >>> 0;
    }
  end

  def genrand_res53
    %x{
      var a = this.genrand_int32() >>> 5,
          b = this.genrand_int32() >>> 6;
      return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    }
  end

  public

  DEFAULT = self.new

  def self.srand(new_seed = self.class.new_seed)
    DEFAULT.srand(new_seed)
  end

  def self.new_seed
    # We don't exactly have a source of high-entropy here.
    `new Date().valueOf()`
  end

  def self.rand(max = nil)
    DEFAULT.rand(max)
  end
end
