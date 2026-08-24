export class PlanDto {
    id: string;
    duration: string;
    price: number;
    description: string;

    constructor(plan:{id: string, duration: string, price: number, description: string} ) {
        this.id = plan.id;
        this.duration = plan.duration;
        this.price = plan.price;
        this.description = plan.description;
    }

}