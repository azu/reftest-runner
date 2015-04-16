# Example

## How to define the target for testing?

Write [reftest.list](reftest.list)

```
# implementation is difference, but visual is the same
== ./equal/smile-canvas.html ./equal/smile-img.html
# ◀ != ▶
!= ./non-equal/canvas-left.html ./non-equal/canvas-right.html
# async test support
== ./async/reftest-async-xhr.html ./async/reftest-sync.html
```

## How to write async test?

See [async](async/) example