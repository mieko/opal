require 'set'
require 'opal/nodes/base'
require 'opal/nodes/runtime_helpers'

module Opal
  module Nodes
    class CallNode < Base
      handle :call

      children :recvr, :meth, :arglist, :iter

      SPECIALS = Set.new

      def self.add_special(name, &handler)
        SPECIALS << name
        define_method("handle_#{name}", &handler)
      end

      def compile
        # if we handle this call specially, just do that and return early
        return if self.handle_special

        compiler.method_calls << meth.to_sym

        # if trying to access an lvar in irb mode
        return compile_irb_var if using_irb?

        mid = mid_to_jsid meth.to_s

        splat = arglist[1..-1].any? { |a| a.first == :splat }

        if Sexp === arglist.last and arglist.last.type == :block_pass
          block = arglist.pop
        elsif iter
          block = iter
        end

        tmpfunc = scope.new_temp if block
        tmprecv = scope.new_temp if splat || tmpfunc

        # must do this after assigning temp variables
        block = expr(block) if block

        recv_code = recv(recv_sexp)
        call_recv = s(:js_tmp, tmprecv || recv_code)

        if tmpfunc and !splat
          arglist.insert 1, call_recv
        end

        args = expr(arglist)

        if tmprecv
          push "(#{tmprecv} = ", recv_code, ")#{mid}"
        else
          push recv_code, mid
        end

        if tmpfunc
          unshift "(#{tmpfunc} = "
          push ", #{tmpfunc}._p = ", block, ", #{tmpfunc})"
        end

        if splat
          push ".apply(", (tmprecv || recv_code), ", ", args, ")"
        elsif tmpfunc
          push ".call(", args, ")"
        else
          push "(", args, ")"
        end

        scope.queue_temp tmpfunc if tmpfunc
      end

      def recv_sexp
        recvr || s(:self)
      end

      # Used to generate the code to use this sexp as an ivar var reference
      def compile_irb_var
        with_temp do |tmp|
          lvar = variable(meth)
          call = s(:call, s(:self), meth.intern, s(:arglist))
          push "((#{tmp} = $opal.irb_vars.#{lvar}) == null ? ", expr(call), " : #{tmp})"
        end
      end

      # a variable reference in irb mode in top scope might be a var ref,
      # or it might be a method call
      def using_irb?
        @compiler.irb? and scope.top? and arglist == s(:arglist) and recvr.nil? and iter.nil?
      end

      # Handle "special" method calls, e.g. require(). Subclasses can override
      # this method. If this method returns nil, then the method will continue
      # to be generated by CallNode.
      def handle_special
        if SPECIALS.include? meth
          if result = __send__("handle_#{meth}")
            push result
            return true
          end
        elsif RuntimeHelpers.compatible?(recvr, meth, arglist)
          push(RuntimeHelpers.new(@sexp, @level, @compiler).compile)
          return true
        end
      end

      add_special :require do
        str = DependencyResolver.new(compiler, arglist[1]).resolve
        compiler.requires << str unless str.nil?
        stmt? ? fragment('') : fragment('true')
      end

      add_special :autoload do
        if scope.class_scope?
          str = DependencyResolver.new(compiler, arglist[2]).resolve
          compiler.requires << str unless str.nil?
          fragment ''
        end
      end

      add_special :block_given? do
        compiler.handle_block_given_call @sexp
      end

      add_special :__callee__ do
        if scope.def?
          fragment scope.mid.to_s.inspect
        else
          fragment 'nil'
        end
      end

      add_special :__method__ do
        if scope.def?
          fragment scope.mid.to_s.inspect
        else
          fragment 'nil'
        end
      end

      add_special :debugger do
        fragment 'debugger'
      end

      class DependencyResolver
        def initialize(compiler, sexp)
          @compiler = compiler
          @sexp = sexp
        end

        def resolve
          handle_part @sexp
        end

        def handle_part(sexp)
          type = sexp.type

          if type == :str
            return sexp[1]
          elsif type == :call
            _, recv, meth, args = sexp

            parts = args[1..-1].map { |s| handle_part s }

            if recv == [:const, :File]
              if meth == :expand_path
                return expand_path(*parts)
              elsif meth == :join
                return expand_path parts.join('/')
              elsif meth == :dirname
                return expand_path parts[0].split('/')[0...-1].join('/')
              end
            end
          end

          msg = "Cannot handle dynamic require"
          case @compiler.dynamic_require_severity
          when :error
            @compiler.error msg, @sexp.line
          when :warning
            @compiler.warning msg, @sexp.line
          end
        end

        def expand_path(path, base = '')
          "#{base}/#{path}".split("/").inject([]) do |p, part|
            if part == ''
              # we had '//', so ignore
            elsif part == '..'
              p.pop
            else
              p << part
            end

            p
          end.join "/"
        end
      end
    end
  end
end
