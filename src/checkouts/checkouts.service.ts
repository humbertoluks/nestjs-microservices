import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { Checkout } from './entities/checkout.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// orquestra regras de negócio refinadas e/com regras de usuários

const PRODUCTLIST = [
  {
    id: 1,
    name: 'Produto 1',
    description: 'Descrição do produto 1',
    image_url: 'https://via.placeholder.com/150',
    price: 10,
    category_id: 1,
  },
  {
    id: 2,
    name: 'Produto 2',
    description: 'Descrição do produto 2',
    image_url: 'https://via.placeholder.com/150',
    price: 20,
    category_id: 1,
  },
  {
    id: 3,
    name: 'Produto 3',
    description: 'Descrição do produto 3',
    image_url: 'https://via.placeholder.com/150',
    price: 30,
    category_id: 1,
  },
  ,
  {
    id: 4,
    name: 'Produto 4',
    description: 'Descrição do produto 4',
    image_url: 'https://via.placeholder.com/150',
    price: 40,
    category_id: 1,
  },
  {
    id: 5,
    name: 'Produto 5',
    description: 'Descrição do produto 5',
    image_url: 'https://via.placeholder.com/150',
    price: 50,
    category_id: 1,
  },
];

@Injectable()
export class CheckoutsService {
  constructor(
    @InjectRepository(Checkout) private checkoutRepo: Repository<Checkout>,
  ) {}
  async create(createCheckoutDto: CreateCheckoutDto) {
    const productsIds = createCheckoutDto.items.map((item) => item.product_id);
    const products = PRODUCTLIST.filter((product) =>
      productsIds.includes(product.id),
    );
    const checkout = Checkout.create({
      items: createCheckoutDto.items.map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return {
          quantity: item.quantity,
          price: product.price,
          product: {
            name: product.name,
            description: product.description,
            image_url: product.image_url,
            product_id: product.id,
          },
        };
      }),
    });

    await this.checkoutRepo.save(checkout);
    return checkout;
  }

  async findAll() {
    return await this.checkoutRepo.find();
  }

  async findOne(id: number) {
    return await this.checkoutRepo.findOneByOrFail({ id });
  }

  async pay(id: number) {
    const checkout = await this.checkoutRepo.findOneByOrFail({ id });
    checkout.pay();
    await this.checkoutRepo.save(checkout);
  }

  async fail(id: number) {
    const checkout = await this.checkoutRepo.findOneByOrFail({ id });
    checkout.fail();
    await this.checkoutRepo.save(checkout);
  }
}
