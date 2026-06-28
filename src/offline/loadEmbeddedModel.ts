import * as tf from '@tensorflow/tfjs';

import { modelTopology, weightSpecs, weightDataB64 } from './embeddedModel.generated';

function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Loads the MobileNet graph model entirely from in-memory data — no fetch(), so it
// works when the app is opened directly from the filesystem (file://).
export async function loadEmbeddedModel(): Promise<tf.GraphModel> {
  const weightData = base64ToArrayBuffer(weightDataB64);
  return tf.loadGraphModel(
    tf.io.fromMemory({ modelTopology, weightSpecs, weightData })
  );
}
