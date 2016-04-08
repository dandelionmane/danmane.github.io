This folder allows us to serve live TensorBoards inside TensorFlow.org

How it works:
* webcomponents-lite.min.js
Polyfill for web imports if needed

* lib
Various static assets that may be required

* index.html
An example of a working TensorBoard with pathing set up properly. Can be
copy+pasted to other directories to set up other TensorBoards.

* data
Put all the data for TensorBoards in subdirectories here.

The MNIST dataset was generated as follows:
  run tensorflow/examples/tutorials/mnist/mnist_with_summaries.py
  run serialize_tensorboard --logdir=/tmp/mnist_logs
  Then move the output data into this directory.

To tar everything together:
  tar -zcvf tensorboard.tar.gz
