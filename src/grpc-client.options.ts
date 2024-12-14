import { ReflectionService } from "@grpc/reflection";
import { GrpcOptions, Transport } from "@nestjs/microservices";
import { join } from "path";

export const grpcClientOptions: GrpcOptions = {
    transport: Transport.GRPC,
    options: {
      package: 'user', // ['hero', 'hero2']
      protoPath: join(__dirname, './user/user.proto'), // ['./hero/hero.proto', './hero/hero2.proto']
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server);
      },
    },
  };
  