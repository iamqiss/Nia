fn main() {
    let proto_root = "../time-server/proto";
    let services = vec![format!("{}/services/fanout.proto", proto_root)];

    println!("cargo:rerun-if-changed={}", proto_root);
    tonic_build::configure()
        .build_server(true)
        .build_client(true)
        .include_file("mod.rs")
        .compile(&services, &[proto_root])
        .expect("failed to compile protos");
}

