import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', '.well-known', 'assetlinks.json');
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return new Response(fileContent, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify([{
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "id.my.brody.tanam",
        sha256_cert_fingerprints: ["E5:78:4D:63:04:39:A6:57:CB:4A:1A:75:41:1A:D8:97:F7:69:28:A3:1F:DC:9E:76:72:3A:53:D0:30:BE:52:6D"]
      }
    }]), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
