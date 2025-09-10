fn main() -> Result<(), Box<dyn std::error::Error>> {
    let descriptor_path = std::path::Path::new("descriptor.bin");
    tonic_build::configure()
        .build_server(true)
        .build_client(false)
        .file_descriptor_set_path(&descriptor_path)
        .compile(&["proto/service.proto"], &["proto"]) ?;
    Ok(())
}
