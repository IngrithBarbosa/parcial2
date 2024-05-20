/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import { ClubEntity } from '../club/club.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioClubService } from './socio-club.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SocioClubService', () => {
  let service: SocioClubService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let sociosList : SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioClubService],
    }).compile();

    service = module.get<SocioClubService>(SocioClubService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    socioRepository.clear();
    clubRepository.clear();

    sociosList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await socioRepository.save({
          nombreUsuario: faker.person.fullName(),
          correo: faker.internet.email(),
          fechaNacimiento: faker.date.birthdate()
        })
        sociosList.push(socio);
    }

    club = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.birthdate(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.paragraph(),
      socios: sociosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSocioClub should add an socio to a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.person.fullName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate()
    });

    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.birthdate(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.paragraph()
    })

    const result: ClubEntity = await service.addSocioClub(newClub.id, newSocio.id);
    
    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].nombreUsuario).toEqual(newSocio.nombreUsuario)
    expect(result.socios[0].fechaNacimiento).toEqual(newSocio.fechaNacimiento)
    expect(result.socios[0].correo).toEqual(newSocio.correo)
  });

  it('addSocioClub should thrown exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.birthdate(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.paragraph()
    })

    await expect(() => service.addSocioClub(newClub.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });

  it('addSocioClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.person.fullName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate()
    });

    await expect(() => service.addSocioClub("0", newSocio.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findSocioByClubIdSocioId should return socio by club', async () => {
    const socio: SocioEntity = sociosList[0];
    const storedSocio: SocioEntity = await service.findSocioByClubIdSocioId(club.id, socio.id, )
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombreUsuario).toEqual(socio.nombreUsuario);
    expect(storedSocio.correo).toEqual(socio.correo);
    expect(storedSocio.fechaNacimiento).toEqual(socio.fechaNacimiento);
  });

  it('findSocioByClubIdSocioId should throw an exception for an invalid socio', async () => {
    await expect(()=> service.findSocioByClubIdSocioId(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found"); 
  });

  it('findSocioByClubIdSocioId should throw an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0]; 
    await expect(()=> service.findSocioByClubIdSocioId("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('findSocioByClubIdSocioId should throw an exception for an socio not associated to the club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.person.fullName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate()
    });

    await expect(()=> service.findSocioByClubIdSocioId(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club"); 
  });

  it('findSociosByClubId should return socios by club', async ()=>{
    const socios: SocioEntity[] = await service.findSociosByClubId(club.id);
    expect(socios.length).toBe(5)
  });

  it('findSociosByClubId should throw an exception for an invalid club', async () => {
    await expect(()=> service.findSociosByClubId("0")).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('associateSociosClub should update socios list for a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.person.fullName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate()
    });

    const updatedClub: ClubEntity = await service.updateSociosClub(club.id, [newSocio]);
    expect(updatedClub.socios.length).toBe(1);

    expect(updatedClub.socios[0].nombreUsuario).toBe(newSocio.nombreUsuario);
    expect(updatedClub.socios[0].correo).toBe(newSocio.correo);
    expect(updatedClub.socios[0].fechaNacimiento).toBe(newSocio.fechaNacimiento);
  });

  it('associateSociosClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.person.fullName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate()
    });

    await expect(()=> service.updateSociosClub("0", [newSocio])).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('associateSociosClub should throw an exception for an invalid socio', async () => {
    const newSocio: SocioEntity = sociosList[0];
    newSocio.id = "0";

    await expect(()=> service.updateSociosClub(club.id, [newSocio])).rejects.toHaveProperty("message", "The socio with the given id was not found"); 
  });

  it('deleteSocioToClub should remove an socio from a club', async () => {
    const socio: SocioEntity = sociosList[0];
    
    await service.deleteSocioClub(club.id, socio.id);

    const storedClub: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations: ["socios"]});
    const deletedSocio: SocioEntity = storedClub.socios.find(a => a.id === socio.id);

    expect(deletedSocio).toBeUndefined();

  });

  it('deleteSocioToClub should thrown an exception for an invalid socio', async () => {
    await expect(()=> service.deleteSocioClub(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found"); 
  });

  it('deleteSocioToClub should thrown an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(()=> service.deleteSocioClub("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('deleteSocioToClub should thrown an exception for an non asocciated socio', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombreUsuario: faker.person.fullName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate()
    });

    await expect(()=> service.deleteSocioClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club"); 
  }); 

});
