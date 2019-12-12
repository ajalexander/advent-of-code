import { Moon, Position, System, SystemModeler } from './SystemModeler';

const system = new System();
system.moons.push(new Moon(new Position(15, -2, -6)));
system.moons.push(new Moon(new Position(-5, -4, -11)));
system.moons.push(new Moon(new Position(0, -6, 0)));
system.moons.push(new Moon(new Position(5, 9, 6)));

const modeler = new SystemModeler(system);
modeler.adjustAndMove(1000);

console.log(`Total energy in the system is ${system.totalEnergy()} after 1000 movements`);
